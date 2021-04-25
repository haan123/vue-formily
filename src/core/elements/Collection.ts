import { GroupSchema, CollectionSchema, ElementData } from './types';

import Element from './Element';
import Group from './Group';
import { cascadeRules, genHtmlName, indentifySchema, invalidateSchemaValidation, normalizeRules } from '../../helpers';
import { def, findIndex, getter, logMessage, ref, Ref } from '../../utils';
import { Validation } from '../validations';

export class CollectionItem extends Group {
  index!: number;

  constructor(schema: GroupSchema, parent: Collection) {
    super(schema, parent);

    getter(this, 'index', () => {
      const { groups } = this.parent as any;

      return findIndex(groups, (group: any) => group === this);
    });
  }
}

type CollectionData = ElementData & {
  value: Ref<any[] | null>;
};

export default class Collection extends Element {
  static FORM_TYPE = 'collection';
  static accept(schema: any) {
    const { identified, sv } = indentifySchema(schema, Collection.FORM_TYPE);

    if (!identified) {
      if (schema.group === undefined) {
        invalidateSchemaValidation(sv, "invalid schema, 'group' is empty or missing", { formId: schema.formId });
      } else {
        const accepted = Group.accept(schema.group);

        if (!accepted.valid) {
          invalidateSchemaValidation(sv, `invalid schema.group, ${accepted.reason}`, { ...accepted.infos, formId: schema.formId });
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

  readonly formType!: string;
  readonly type!: 'set';
  readonly value!: any[] | null;

  readonly error!: string | null;
  protected _d!: CollectionData;

  validation!: Validation;

  groups: CollectionItem[] | null;

  constructor(schema: CollectionSchema, ...args: any[]) {
    super(schema, ...args);

    const accepted = Collection.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(accepted.reason, accepted.infos));
    }

    def(this, 'formType', Collection.FORM_TYPE);
    def(this, 'type', 'set');
    def(this, 'validation', new Validation(normalizeRules(schema.rules, this.props, this.type, this, { field: this })));
    getter(this, 'error', this.getError);

    const value = ref(null);

    getter(this, 'value', value);

    this._d.value = value;

    this.groups = null;

    if (schema.rules) {
      schema.group.fields = cascadeRules(schema.rules, schema.group.fields);
    }
  }

  async setValue(value: any[], { from = 0, autoAdd = true }: { from?: number; autoAdd?: boolean; } = {}) {
    if (!Array.isArray(value)) {
      throw new Error(logMessage('Invalid value, Group value must be an object'));
    }
    const groups = this.groups ? this.groups.slice(from) : [];

    await Promise.all(value.slice(0, autoAdd ? value.length : groups.length).map(async (val: Record<string, any>, index: number) => {
      const group = groups[index]

      if (!group) {
        await this.addGroup(val);
      } else {
        await group.setValue(val);
      }
    }));

    this.emit('validated', this);

    return this.value;
  }

  shake({ cascade = true }: { cascade?: boolean } = {}) {
    super.shake();

    if (cascade && this.groups) {
      this.groups.forEach((group) => group.shake());
    }
  }

  getError() {
    if (!this.shaked || this.valid) {
      return null;
    }

    return this._d.error || (this.validation.errors ? this.validation.errors[0] : null);
  }

  getHtmlName(): string {
    return genHtmlName(this, this._d.ancestors);
  }

  isValid(): boolean {
    return !this._d.invalidated && this.validation.valid && (!this.groups || !this.groups.some(g => !g.valid));
  }

  reset() {
    this.cleanUp();

    if (this.groups) {
      this.groups.forEach((group: any) => group.reset());
    }

    this.validation.reset();
  }

  clear() {
    this.cleanUp();

    if (this.groups) {
      this.groups.forEach((group: any) => group.clear());
    }
  }

  async addGroup(value?: Record<string, any>): Promise<CollectionItem> {
    if (!this.groups) {
      this.groups = [];
    }

    const groupItem = new CollectionItem(
      {
        ...this._d.schema.group,
        formId(this: CollectionItem) {
          return `${(this.parent as Collection).formId}${this.index}`;
        }
      },
      this
    );

    groupItem.on('validated', async (group: CollectionItem) => {
      if (group.valid) {
        const valueRef = this._d.value;

        if (!valueRef.value) {
          valueRef.value = []
        }

        valueRef.value[group.index] = group.value
      }

      await this.validate({ cascade: false })
    });

    if (value) {
      await groupItem.setValue(value);
    }

    this.groups.push(groupItem);

    return groupItem;
  }

  async validate({ cascade = true }: { cascade?: boolean } = {}) {
    if (cascade && this.groups) {
      await Promise.all(
        this.groups.map(async (group: any) => await group.validate())
      );
    }

    await this.validation.validate(this.value);
  }
}
