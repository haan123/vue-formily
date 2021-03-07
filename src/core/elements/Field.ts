import { ValidationResult } from '../validations/types';
import { ElementData, FieldSchema, FieldType, FieldValue, Format } from './types';

import Element from './Element';
import { def, logMessage, isCallable, setter, getter, ref, Ref } from '../../utils';
import Validation, { ExtValidation } from '../validations/Validation';
import { normalizeRules, indentifySchema, invalidateSchemaValidation, genHtmlName, getPlug } from '../../helpers';
import { numeric, dateTime } from '../../rules';
import { Rule } from '../validations';
import { DATE_TIME_FORMATTER, LOCALIZER, STRING_FORMATTER, NUMBER_FORMATTER } from '../../constants';

type FieldValidationResult = ValidationResult & {
  value: FieldValue;
};

type FieldData = ElementData & {
  error: string | null;
  raw: Ref<any>;
  typed: Ref<FieldValue>;
};

const dumpRule = new Rule(() => true);

const typing: Record<string, {
  cast: (value: any) => FieldValue;
  formatter?: string;
  rule?: Rule;
}> = {
  string: {
    cast(value: any) {
      return value !== null ? '' + value : null;
    },
    formatter: STRING_FORMATTER
  },
  number: {
    rule: new Rule(numeric),
    cast(value: any) {
      return +value;
    },
    formatter: NUMBER_FORMATTER
  },
  boolean: {
    cast(value: any) {
      return value === true || value === 'true' ? true : false;
    }
  },
  date: {
    rule: new Rule(dateTime),
    cast(value: any) {
      return new Date(value);
    },
    formatter: DATE_TIME_FORMATTER
  }
}

function formatter(field: Field, format?: Format, options?: Record<string, any>): string {
  const { type, props, raw, value } = field;
  const _formatter = getPlug(typing[type].formatter || '');

  if (!format || !_formatter) {
    return raw;
  }

  const localizer = getPlug(LOCALIZER);
  const args = [props, {
    field
  }];
  const result = _formatter(value, isCallable(format) ? format.call(field, value) : format, options, ...args);

  return localizer ? localizer(result, ...args) : result;
}

export default class Field extends Element {
  static FORM_TYPE = 'field';
  static FIELD_TYPE_STRING = 'string';
  static FIELD_TYPE_NUMBER = 'number';
  static FIELD_TYPE_BOOLEAN = 'boolean';
  static FIELD_TYPE_DATE = 'date';

  static accept(schema: any) {
    const type: FieldType = schema.type ? (Field as any)[`FIELD_TYPE_${schema.type.toUpperCase()}`] : Field.FIELD_TYPE_STRING;

    const { identified, sv } = indentifySchema(schema, type);

    if (!identified) {
      if (!type) {
        invalidateSchemaValidation(sv, `type '${schema.type}' is not supported`, {
          formId: schema.formId
        });
      }

      if (sv.valid) {
        schema.__is__ = schema.type = type;
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
  readonly default!: any;
  readonly formatted!: string | null;
  readonly error!: string | null;
  readonly checked!: boolean;
  readonly validation!: Validation;
  protected _d!: FieldData;

  shaked!: boolean;
  pending = false;
  raw!: string;
  value!: FieldValue;

  constructor(schema: FieldSchema, parent?: Element) {
    super(schema, parent);

    const accepted = Field.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`[Schema error] ${accepted.reason}`, accepted.infos));
    }

    const { type, rules, inputType = 'text', format, formatOptions, default: defu } = schema;

    def(this, 'formType', Field.FORM_TYPE);
    def(this, 'type', type);
    def(this, 'inputType', inputType);

    def(this, 'validation', new Validation(normalizeRules(rules, this.props, this.type, this, { field: this })));

    const typi = typing[this.type];

    if (typi.rule && !(typi.rule.name in this.validation)) {
      this.validation.addRule(typi.rule)
    }

    const hasDefault = defu !== undefined;
    def(this, 'default', hasDefault ? defu : null);

    const value = schema.value !== undefined ? schema.value : defu

    const formatted = ref(null);
    const raw = ref('');
    const typed = ref(null);

    setter(this, 'value', typed, (val: any) => {
      raw.value = '' + val;

      this.validate(raw.value).then(({ value }) => {
        typed.value = value;
        formatted.value = formatter(this, format, formatOptions);
      });
    });

    setter(this, 'raw', raw, (val: any) => {
      this.value = val;
    });

    setter(this, 'shaked', false, (val: boolean) => {
      this._d.error = val && this.validation.errors ? this.validation.errors[0] : null;

      return val;
    });

    getter(this, 'formatted', formatted);
    getter(this, 'error', this.getError);
    getter(this, 'checked', this.isChecked);

    if (value !== undefined) {
      this.value = value;
    }

    this._d.raw = raw;
    this._d.typed = typed;
  }

  getError() {
    return this.shaked ? this._d.error : null;
  }

  isChecked() {
    return this.value === true;
  }

  isValid() {
    return this.validation.valid;
  }

  invalidate(error?: string) {
    this._d.invalidated = true;
    this._d.error = error ? error : (this.validation.errors ? this.validation.errors[0] : null);
  }

  reset() {
    this.clear();

    this._d.raw.value = this.default !== null ? this.default : '';
  }

  clear() {
    this._d.raw.value = '';
    this._d.typed.value = null;

    this.validation.reset();

    this.clean();
  }

  clean() {
    this.shaked = false;
  }

  shake() {
    this.shaked = true
  }

  getHtmlName(): string {
    return genHtmlName(this, this._d.ancestors);
  }

  async validate(val?: any): Promise<FieldValidationResult> {
    const raw = val !== undefined ? val : this.raw;
    const typi = typing[this.type];
    let castingRule: Rule = dumpRule;
    let typed: FieldValue = null;

    this.pending = true;

    if (typi.rule) {
      castingRule = (this.validation as ExtValidation<any>)[typi.rule.name];
    }

    let { valid, error } = await castingRule.validate(raw);
    let errors: string[] | null = [];

    if (valid) {
      typed = typi.cast(raw);
      ({ valid, errors } = await this.validation.validate(typed, { excluded: [castingRule.name] }));
    } else if (error) {
      errors.push(error)
    }

    this.pending = false;

    return {
      errors,
      valid,
      value: valid ? typed : null
    };
  }
}
