import { ElementData, GroupSchema } from './types';

import {
  cascadeRules,
  genHtmlName,
  normalizeRules,
  indentifySchema,
  invalidateSchemaValidation,
} from '../../helpers';
import { genFields } from '../../helpers/elements';
import Element from './Element';
import { def, getter, isPlainObject, logMessage, Ref, ref, setter } from '../../utils';
import Validation from '../validations/Validation';

type GroupData = ElementData & {
  value: Ref<Record<string, any> | null>;
};

export default class Group extends Element {
  static FORM_TYPE = 'group';
  static accept(schema: any) {
    const { identified, sv } = indentifySchema(schema, Group.FORM_TYPE);

    if (!identified) {
      if (!Array.isArray(schema.fields) || !schema.fields.length) {
        invalidateSchemaValidation(sv, "'fields' is empty or missing", { formId: schema.formId });
      }

      if (sv.valid) {
        schema.__is__ = Group.FORM_TYPE;
      }
    }

    return sv;
  }

  static create(schema: GroupSchema, parent?: Element): Group {
    return new Group(schema, parent);
  }

  readonly formType!: string;
  readonly type!: 'enum';
  readonly error!: string | null;
  protected _d!: GroupData;
  value!: Record<string, any> | null;

  validation!: Validation;

  fields: Element[];

  readonly [key: string]: any;

  constructor(schema: GroupSchema, parent?: Element) {
    super(schema, parent);

    const accepted = Group.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`[Schema error] ${accepted.reason}`, accepted.infos));
    }

    def(this, 'formType', Group.FORM_TYPE);
    def(this, 'type', 'enum');

    if (schema.rules) {
      schema.fields = cascadeRules(schema.rules, schema.fields);
    }

    this.fields = genFields(schema.fields, this) as Element[];

    this.fields.forEach((field) => {
      def(this, field.model, field);

      field.on('validated', async (element: any) => {
        if (element.valid) {
          const valueRef = this._d.value;

          if (!valueRef.value) {
            valueRef.value = {}
          }

          valueRef.value[element.model] = element.value
        }

        await this.validate({ cascade: false })
      })
    });

    const value = ref(null);

    def(this, 'validation', new Validation(normalizeRules(schema.rules, this.props, this.type, this, { field: this })));
    getter(this, 'error', this.getError);
    setter(this, 'value', value, this.setValue);

    this._d.value = value;
  }

  async setValue(obj: Record<string, any>) {
    if (!isPlainObject(obj)) {
      throw new Error(logMessage('Invalid value, Group value must be an object'));
    }

    await Promise.all(Object.keys(obj).map(async (model) => {
      const element = this[model];

      if (model) {
        await element.setValue(obj[model]);
      }
    }))

    this.emit('validated', this);

    return this.value
  }

  shake() {
    super.shake();

    this.fields.forEach((field) => field.shake());
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
    return !this._d.invalidated && this.validation.valid && !this.fields.some((field) => !field.valid);
  }

  reset() {
    this.cleanUp();

    this.fields.forEach((field: any) => field.reset());
  }

  clear() {
    this.cleanUp();

    this.fields.forEach((field: any) => field.clear());
  }

  async validate({ cascade = true}: { cascade?: boolean } = {}) {
    if (cascade) {
      await Promise.all(
        this.fields.filter((field: any) => 'validate' in field).map(async (field: any) => await field.validate())
      );
    }

    await this.validation.validate(this.value);
  }
}
