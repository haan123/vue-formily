import FormElement from './FormElement';
import {
  cascadeRules,
  genHtmlName,
  genProps,
  genValidationRules,
  indentifySchema,
  invalidateSchemaValidation,
  traverseFields
} from '../helpers';
import { genFields } from '../helpers/groups';
import { FormElementData, FormGroupSchema, FormilyElements, SchemaValidation, ValidationResult } from '../../types';
import { def, logMessage } from '../utils';
import Validation from './Validation';

type FormGroupData = FormElementData;
const _privateData = new WeakMap<FormGroup, FormGroupData>();

export default class FormGroup extends FormElement {
  static FORM_TYPE = 'group';
  static accept(schema: any): SchemaValidation {
    const { identified, sv } = indentifySchema(schema, FormGroup.FORM_TYPE);

    if (!identified) {
      if (schema.formType !== FormGroup.FORM_TYPE) {
        invalidateSchemaValidation(sv, `'formType' must be '${FormGroup.FORM_TYPE}'`, { formId: schema.formId });
      } else if (!schema.fields || !schema.fields.length) {
        invalidateSchemaValidation(sv, "'fields' is empty or missing", { formId: schema.formId });
      }

      if (sv.valid) {
        schema.__is__ = FormGroup.FORM_TYPE;
      }
    }

    return sv;
  }

  static create(schema: any, ...args: any[]): FormGroup {
    return new FormGroup(schema, ...args);
  }

  readonly props!: Record<string, any> | null;
  readonly formType!: 'group';
  readonly type!: 'enum';

  fields: FormilyElements[];

  constructor(schema: FormGroupSchema, parent: any = null, ...args: any[]) {
    super(schema, parent, ...args);

    const accepted = FormGroup.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, accepted.infos));
    }

    def(this, 'formType', FormGroup.FORM_TYPE, { writable: false });
    def(this, 'type', 'enum', { writable: false });

    if (schema.rules) {
      schema.fields = cascadeRules(schema.rules, schema.fields);
    }

    this.fields = genFields(schema.fields, this);

    const props = (this.props = genProps([schema.props], this));

    const validationRules = genValidationRules(schema.rules, props, this.type, this);

    def(this, 'validation', new Validation(validationRules, { field: this }), { writable: false });
  }

  initialize(schema: FormGroupSchema, parent: any, data: FormGroupData) {
    _privateData.set(this, data);
  }

  getHtmlName(): string {
    return genHtmlName(this, (_privateData.get(this) as FormGroupData).ancestors);
  }

  isValid(): boolean {
    return !this.invalidated() && !this.fields.find(f => !f.valid);
  }

  getField(path: string | string[] = [], fields?: FormilyElements[]): FormilyElements | null {
    return traverseFields(path, fields || this.fields);
  }

  async validate(val: any): Promise<ValidationResult> {
    const result = await this.validation.validate(val);

    return result;
  }
}
