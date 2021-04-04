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
import { def, getter, logMessage } from '../../utils';
import Validation from '../validations/Validation';

type GroupData = ElementData & {

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

      this.on('validated', () => {
        this.validate()
      })
    });

    def(this, 'validation', new Validation(normalizeRules(schema.rules, this.props, this.type, this, { field: this })));

    getter(this, 'error', this.getError);
  }

  copyTo(obj: Record<string, any>): Record<string, any> {
    return this.fields.reduce((acc: Record<string, any>, field: any) => {
      const value = obj[field.formId];

      if (field.type === 'set' || field.type === 'enum') {
        this.copyTo(value)
      }
      obj[field.formId] = field.value;

      return obj;
    }, obj);
  }

  copyFrom(obj: Record<string, any>) {

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

  async validate(): Promise<Validation> {
    const result = await this.validation.validate();

    return result;
  }
}
