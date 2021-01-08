import { ValidationResult } from '../validations/types';
import { ElementData, FieldSchema, FieldType, FieldValue } from './types';

import Element, { reactiveGetter } from './Element';
import { def, logMessage, isCallable, setter, ref, Ref, isNumber, isEmpty } from '../../utils';
import Validation from '../validations/Validation';
import { normalizeRules, indentifySchema, invalidateSchemaValidation, genHtmlName } from '../../helpers';

type FieldValidationResult = ValidationResult & {
  value: FieldValue;
};

type FieldData = ElementData & {
  error: string | null;
  default: string | number | boolean | null;
  raw: Ref;
  typed: Ref;
};

let _privateData: FieldData;

export function cast(value: any, type: FieldType): FieldValue {
  if (value === undefined) {
    return null;
  }

  switch (type) {
    case 'string':
      return value ? '' + value : '';
    case 'number':
      return isNumber(value) ? +value : null;
    case 'boolean':
      return !!value;
    case 'date':
      try {
        return new Date(value);
      } catch (error) {
        return null;
      }
  }
}

function formatter(value: any): string { return value }

export default class Field extends Element {
  static FORM_TYPE = 'field';
  static FIELD_TYPE_STRING = 'string';
  static FIELD_TYPE_NUMBER = 'number';
  static FIELD_TYPE_BOOLEAN = 'boolean';
  static FIELD_TYPE_DATE = 'date';

  static accept(schema: any) {
    const type: FieldType = (Field as any)[`FIELD_TYPE_${schema.type && schema.type.toUpperCase()}`];

    const { identified, sv } = indentifySchema(schema, type);

    if (!identified) {
      if (!type) {
        invalidateSchemaValidation(sv, `type '${schema.type}' is not supported`, {
          formId: schema.formId
        });
      }

      if (sv.valid) {
        schema.__is__ = type;
      }
    }

    return sv;
  }

  static create(schema: FieldSchema, parent?: Element): Field {
    return new Field(schema, parent);
  }

  readonly formType!: string;
  readonly type!: FieldType;
  readonly inputType!: string;
  readonly default!: FieldValue;
  readonly formatted!: string | null;
  readonly error!: string | null;
  readonly checked!: boolean;
  pending = false;
  raw!: string;
  value!: FieldValue;
  validation!: Validation;

  constructor(schema: FieldSchema, parent?: Element) {
    super(schema, parent);

    const accepted = Field.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, accepted.infos));
    }

    const { type, rules, inputType = 'text' } = schema;

    def(this, 'formType', Field.FORM_TYPE, { writable: false });
    def(this, 'type', type, { writable: false });
    def(this, 'inputType', inputType, { writable: false });

    const defu = schema.default !== undefined ? schema.default : null;
    const defaultValue = cast(defu, this.type);

    def(this, 'default', defaultValue, { writable: false });
    def(this, 'validation', new Validation(normalizeRules(rules, this.props, this.type, this), { field: this }), { writable: false });

    const format = isCallable(schema.format) ? schema.format : formatter;

    const formatted = ref(format.call(this, this.default));
    const raw = ref(defu || '');
    const typed = ref(null);

    setter(this, 'value', typed, (val: any) => {
      raw.value = val;

      this.validate(raw.value).then(({ value }) => {
        typed.value = value;
        formatted.value = format.call(this, typed.value);
      });
    });

    setter(this, 'raw', raw, (val: any) => {
      raw.value = val;
      this.value = val;
    });

    reactiveGetter(this, 'formatted', formatted);
    reactiveGetter(this, 'error', () => _privateData.error);
    reactiveGetter(this, 'checked', () => this.value === true);

    _privateData.default = defu;
    _privateData.raw = raw;
    _privateData.typed = typed;
  }

  isValid() {
    return !_privateData.error;
  }

  invalidate(error?: string) {
    const { errors } = this.validation;

    _privateData.error = error ? error : !isEmpty(errors) ? errors[0] :  null;
  }

  reset() {
    _privateData.error = null;
    _privateData.raw.value = _privateData.default || '';
    _privateData.typed.value = null;

    this.validation.reset();
  }

  initialize(schema: FieldSchema, parent: any, data: ElementData) {
    _privateData = data as FieldData;
  }

  getHtmlName(): string {
    return genHtmlName(this, _privateData.ancestors);
  }

  async validate(val: any): Promise<FieldValidationResult> {
    let value: FieldValue = null;
    let result: ValidationResult;

    this.pending = true;

    result = await this.validation.validate(val);

    if (result.errors) {
      value = cast(val, this.type);
    }

    this.pending = false;

    return {
      ...result,
      value
    };
  }
}
