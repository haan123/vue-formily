import { CollectionSchema, ElementData } from './types';

import Element from './Element';
import Group from './Group';
import { cascadeRules, indentifySchema, invalidateSchemaValidation, normalizeRules } from '../../helpers';
import { findIndex, logMessage, readonlyDumpProp } from '../../utils';
import { Validation } from '../validations';

export class CollectionItem extends Group {
  get index() {
    const { groups } = this.parent as any;

    return findIndex(groups, (group: any) => group === this);
  }

  get formId() {
    return `${(this.parent as Collection).formId}${this.index}`;
  }
}

type CollectionData = ElementData & {
  value: any[] | null;
  pending: boolean;
};

async function onGroupValidate(this: Collection, ...args: any[]) {
  const [group] = args;

  this._d.pending = true;

  if (group.valid) {
    let value = this._d.value;

    if (!value) {
      value = this._d.value = [];
    }

    value[group.index] = group.value;
  }

  await this.validate({ cascade: false });

  this.emit('changed', this, ...args);
}

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
          invalidateSchemaValidation(sv, `invalid schema.group, ${accepted.reason}`, {
            ...accepted.infos,
            formId: schema.formId
          });
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

  protected _d!: CollectionData;

  groups: CollectionItem[] | null;

  constructor(schema: CollectionSchema, parent?: Element | null) {
    super(schema, parent);

    const accepted = Collection.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(accepted.reason, accepted.infos));
    }

    readonlyDumpProp(this, 'formType', Collection.FORM_TYPE);
    readonlyDumpProp(this, 'type', 'set');

    this._d.validation = new Validation(normalizeRules(schema.rules, this.type));

    this._d.value = null;

    this.groups = null;

    if (schema.rules) {
      schema.group.fields = cascadeRules(schema.rules, schema.group.fields);
    }
  }

  get pending() {
    return this._d.pending;
  }

  get value() {
    return this._d.value;
  }

  async setValue(value: any[], { from = 0, autoAdd = true }: { from?: number; autoAdd?: boolean } = {}) {
    if (!Array.isArray(value)) {
      throw new Error(logMessage('Invalid value, Group value must be an object'));
    }

    const groups = this.groups ? this.groups.slice(from) : [];

    await Promise.all(
      value.slice(0, autoAdd ? value.length : groups.length).map(async (val: Record<string, any>, index: number) => {
        const group = groups[index];

        if (!group) {
          await this.addGroup().setValue(val);
        } else {
          await group.setValue(val);
        }
      })
    );

    return this.value;
  }

  shake({ cascade = true }: { cascade?: boolean } = {}) {
    super.shake();

    if (cascade && this.groups) {
      this.groups.forEach(group => group.shake());
    }
  }

  isValid(): boolean {
    return this.validation.valid && (!this.groups || !this.groups.some(g => !g.valid));
  }

  reset() {
    this.cleanUp();

    if (this.groups) {
      this.groups.forEach((group: any) => group.reset());
    }

    this.validation.reset();
  }

  async clear() {
    this.cleanUp();

    if (this.groups) {
      await Promise.all(this.groups.map(async (group: any) => await group.clear()));
    }
  }

  addGroup(): CollectionItem {
    if (!this.groups) {
      this.groups = [];
    }

    const groupItem = new CollectionItem(this._d.schema.group, this);

    this.groups.push(groupItem);

    groupItem.on('changed:formy', (...args: any[]) => onGroupValidate.apply(this, args), { noOff: true });

    return groupItem;
  }

  async validate({ cascade = true }: { cascade?: boolean } = {}) {
    this.emit('validate', this);

    if (cascade && this.groups) {
      await Promise.all(this.groups.map(async (group: any) => await group.validate()));
    }

    await this.validation.validate(this.value, {}, this);

    if (!this.valid) {
      this._d.value = null;
    }

    this._d.pending = false;

    this.emit('validated', this);
  }
}
