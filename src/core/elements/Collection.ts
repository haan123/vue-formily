import { ElementData, GroupSchema, CollectionSchema } from './types';

import Element from './Element';
import Group from './Group';
import { cascadeRules, genHtmlName, indentifySchema, invalidateSchemaValidation } from '../../helpers';
import { def, logMessage } from '../../utils';
import { reactiveGetter } from '../Objeto';

let _privateData: ElementData;

export class CollectionItem extends Group {
  index!: number;

  constructor(schema: GroupSchema, parent: Collection) {
    super(schema, parent);

    reactiveGetter(this, 'index', () => {
      const { groups } = this.parent as any;

      return groups?.findIndex((group: any) => group === this);
    });
  }
}

export default class Collection extends Element {
  static FORM_TYPE = 'collection';
  static accept(schema: any) {
    const { identified, sv } = indentifySchema(schema, Collection.FORM_TYPE);

    if (!identified) {
      if (schema.group === undefined) {
        invalidateSchemaValidation(sv, "'group' is empty or missing", { formId: schema.formId });
      } else {
        const accepted = Group.accept(schema.group);

        if (!accepted.valid) {
          invalidateSchemaValidation(sv, `invalid group schema, ${accepted.reason}`, accepted.infos);
        }
      }

      if (sv.valid) {
        schema.__is__ = Collection.FORM_TYPE;
      }
    }

    return sv;
  }

  static create(schema: any, ...args: any[]): Collection {
    return new Collection(schema, ...args);
  }

  readonly _schema!: GroupSchema;
  readonly props!: Record<string, any> | null;
  readonly formType!: string;
  readonly type!: 'set';

  groups: CollectionItem[] | null;

  constructor(schema: CollectionSchema, ...args: any[]) {
    super(schema, ...args);

    const accepted = Collection.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`[Schema error] ${accepted.reason}`, accepted.infos));
    }

    def(this, 'formType', Collection.FORM_TYPE, { writable: false });
    def(this, 'type', 'set', { writable: false });

    this.groups = null;

    if (schema.rules) {
      schema.group.fields = cascadeRules(schema.rules, schema.group.fields);
    }

    def(this, '_schema', schema.group, { writable: false });
  }

  _initialize(schema: CollectionSchema, parent: any, data: ElementData) {
    _privateData = data;
  }

  getHtmlName(): string {
    return genHtmlName(this, _privateData.ancestors);
  }

  invalidate(){

  }

  isValid(): boolean {
    return !!(this.groups && this.groups.find(g => !g.valid));
  }

  addGroup(): CollectionItem {
    if (!this.groups) {
      this.groups = [];
    }

    const groupItem = new CollectionItem(
      {
        ...this._schema,
        formId(this: CollectionItem) {
          return `${(this.parent as Collection).formId}${this.index}`;
        }
      },
      this
    );

    this.groups.push(groupItem);

    return groupItem;
  }
}
