import { ValidationResult } from '../validations/types';
import { ElementData, GroupSchema } from './types';

import {
  cascadeRules,
  genHtmlName,
  normalizeRules,
  indentifySchema,
  invalidateSchemaValidation,
  traverseFields
} from '../../helpers';
import { genFields } from '../../helpers/elements';
import Element from './Element';
import { def, logMessage } from '../../utils';
import Validation from '../validations/Validation';

let _privateData: ElementData;

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

    this.fields.forEach((field) => def(this, field.model, field));

    def(this, 'validation', new Validation(normalizeRules(schema.rules, this.props, this.type, this, { field: this })));
  }

  _initialize(schema: GroupSchema, parent: any, data: ElementData) {
    _privateData = data;
  }

  getHtmlName(): string {
    return genHtmlName(this, _privateData.ancestors);
  }

  invalidate() {

  }

  isValid(): boolean {
    return !this.invalidated() && !this.fields.find(f => !f.valid);
  }

  getField(path: string | string[] = []): Element | null {
    return traverseFields(path, this.fields);
  }

  async validate(val: any): Promise<ValidationResult> {
    const result = await this.validation.validate(val);

    return result;
  }
}
