import { ElementData, FieldSchema, FieldType, FieldValue, Format } from './types';

import Element from './Element';
import { def, logMessage, isCallable, setter, getter, ref, Ref, isUndefined, toString, isPlainObject } from '../../utils';
import Validation, { ExtValidation } from '../validations/Validation';
import { normalizeRules, indentifySchema, invalidateSchemaValidation, genHtmlName, getPlug, genProp } from '../../helpers';
import { numeric, dateTime } from '../../rules';
import { Rule } from '../validations';
import { DATE_TIME_FORMATTER, LOCALIZER,  STRING_FORMATTER, NUMBER_FORMATTER } from '../../constants';

type FieldData = ElementData & {
  error: string | null;
  raw: Ref<any>;
  typed: Ref<FieldValue>;
  checkValue: any;
};

const dumpRule = new Rule(() => true);

const typing: Record<string, {
  cast: (value: any, ...args: any[]) => FieldValue;
  formatter?: string;
  rule?: Rule;
  checkValue?: any;
}> = {
  string: {
    cast(value: any) {
      return value !== null ? toString(value) : null;
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

    const hasDefault = !isUndefined(defu);
    def(this, 'default', hasDefault ? defu : null);

    const value = !isUndefined(schema.value) ? schema.value : defu

    const formatted = ref(null);
    const raw = ref('');
    const typed = ref(null);

    setter(this, 'value', typed, (val: any) => {
      raw.value = toString(val);

      this.validate(raw.value).then(() => {
        formatted.value = formatter(this, format, formatOptions);
      });
    });

    setter(this, 'raw', raw, (val: any) => {
      this.value = val;
    });

    getter(this, 'formatted', formatted);
    getter(this, 'error', this.getError);
    getter(this, 'checked', this.isChecked);

    this._d.raw = raw;
    this._d.typed = typed;

    this.setCheckValue(schema);

    if (!isUndefined(value)) {
      this.value = value;
    }
  }

  getError() {
    if (!this.shaked || this.valid) {
      return null;
    }

    return this._d.error || (this.validation.errors ? this.validation.errors[0] : null);
  }

  setCheckValue(checkValue: any) {
    genProp(this._d, isPlainObject(checkValue) ? checkValue : { checkValue }, 'checkValue', this);
  }

  isChecked() {
    const { checkValue } = this._d;

    if (this.type === Field.FIELD_TYPE_BOOLEAN) {
      return this.value;
    }

    return  !isUndefined(checkValue) && toString(this.value) === checkValue;
  }

  isValid() {
    return !this._d.invalidated && !this.validation.errors;
  }

  reset() {
    this.raw = this.default !== null ? this.default : '';
    this.cleanUp();
  }

  clear() {
    this.raw = '';
    this.cleanUp();
  }

  getHtmlName(): string {
    return genHtmlName(this, this._d.ancestors);
  }

  async validate(val?: any): Promise<Field> {
    const raw = !isUndefined(val) ? val : this.raw;
    const typi = typing[this.type];
    let castingRule: Rule = dumpRule;
    const typed = this._d.typed;

    this.pending = true;

    if (typi.rule) {
      castingRule = (this.validation as ExtValidation<any>)[typi.rule.name];
    }

    let { error } = await castingRule.validate(raw);

    if (!error) {
      const value = typi.cast(raw);
      const { errors } = await this.validation.validate(value, { excluded: [castingRule.name] });

      typed.value = !errors ? value : null;
    } else {
      typed.value = null;
    }

    this.pending = false;

    return this;
  }
}
