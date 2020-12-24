import { ValidationResult } from '../validations/types';
import { ElementData, FieldSchema, FieldType, FieldValue } from './types';

import Element from './Element';
import { def, logError, logMessage, isCallable, getter, setter, ref, Ref, isNumber } from '../../utils';
import Validation from '../validations/Validation';
import { genValidationRules, indentifySchema, invalidateSchemaValidation, genHtmlName } from '../../helpers';

type FieldValidationResult = ValidationResult & {
  value: FieldValue;
};

let _privateData: WeakMap<Element, ElementData>;

export function cast(value: any, type: FieldType): FieldValue {
  let typedValue: FieldValue = null;

  if (value === undefined) {
    return typedValue;
  }

  if (type === 'string') {
    typedValue = value ? '' + value : '';
  } else if (type === 'number') {
    if (!isNumber(value)) {
      throw new Error(`"${value}" is not a "number"`);
    }

    typedValue = +value;
  } else if (type === 'boolean') {
    typedValue = !!value;
  } else if (type === 'date') {
    try {
      typedValue = new Date(value);
    } catch (error) {
      throw new Error(`"${value}" is not a "date" value`);
    }
  }

  return typedValue;
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

  static create(schema: FieldSchema, parent: Element | null = null): Field {
    return new Field(schema, parent);
  }

  readonly formType!: string;
  readonly type!: FieldType;
  readonly inputType!: string;
  readonly default!: FieldValue;
  readonly formatted!: string | null;
  pending = false;
  raw!: string;
  value!: FieldValue;
  validation!: Validation;

  constructor(schema: FieldSchema, parent: Element | null = null) {
    super(schema, parent);

    const accepted = Field.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, accepted.infos));
    }

    const { type, rules, inputType = 'text' } = schema;

    def(this, 'formType', Field.FORM_TYPE, { writable: false });
    def(this, 'type', type, { writable: false });
    def(this, 'inputType', inputType, { writable: false });

    const defaultValue = cast(schema.default, this.type);

    def(this, 'default', defaultValue, { writable: false });

    const validationRules = genValidationRules(rules, this.props, this.type, this);

    def(this, 'validation', new Validation(validationRules, { field: this }), { writable: false });

    const format = isCallable(schema.format) ? schema.format : formatter;

    const formatted = ref(format.call(this, this.default));
    const raw = ref(schema.default !== undefined ? schema.default : '');

    setter(this, 'value', null, (val: any, typed: Ref) => {
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

    getter(this, 'formatted', formatted);

    // trigger validation for value
    this.value = this.raw;
  }

  isValid() {
    return !this.invalidated() && this.validation.valid;
  }

  initialize(schema: FieldSchema, parent: any, data: WeakMap<Element, ElementData>) {
    _privateData = data;
  }

  getHtmlName(): string {
    return genHtmlName(this, (_privateData.get(this) as ElementData).ancestors);
  }

  async validate(val: any): Promise<FieldValidationResult> {
    let value: FieldValue = null;
    let result: ValidationResult = {
      errors: null
    };

    this.pending = true;

    try {
      const typedValue = cast(val, this.type);
      result = await this.validation.validate(typedValue);

      if (!result.errors) {
        value = typedValue;
      }
    } catch (error) {
      logError(`${error}`, {
        formId: this.formId
      });
    }

    this.pending = false;

    return {
      ...result,
      value
    };
  }
}
