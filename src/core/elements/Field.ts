import { ElementData, FieldSchema, FieldType, FieldValue, Format } from './types';

import Element from './Element';
import {
  def,
  logMessage,
  isCallable,
  setter,
  getter,
  ref,
  Ref,
  isUndefined,
  toString,
  isPlainObject,
  noop
} from '../../utils';
import Validation, { ExtValidation } from '../validations/Validation';
import {
  normalizeRules,
  indentifySchema,
  invalidateSchemaValidation,
  genHtmlName,
  getPlug,
  genProp,
  plug
} from '../../helpers';
import { numeric, dateTime } from '../../rules';
import { Rule } from '../validations';
import { DATE_TIME_FORMATTER, LOCALIZER, STRING_FORMATTER, NUMBER_FORMATTER } from '../../constants';

type FieldData = ElementData & {
  error: string | null;
  raw: Ref<any>;
  typed: Ref<FieldValue>;
  checkValue: any;
  formatted: Ref<string | null>;
};

const dumpRule = new Rule(() => true);

const typing: Record<
  string,
  {
    cast: (value: any, ...args: any[]) => FieldValue;
    formatter?: string;
    rule?: Rule;
    checkValue?: any;
  }
> = {
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
      return !!(value === true || value === 'true');
    }
  },
  date: {
    rule: new Rule(dateTime),
    cast(value: any) {
      return new Date(value);
    },
    formatter: DATE_TIME_FORMATTER
  }
};

function formatter(field: Field, format?: Format, options?: Record<string, any>): string {
  const { type, raw, value } = field;
  const _formatter = getPlug(typing[type].formatter || '');
  const localizer = getPlug(LOCALIZER);
  let result = raw;

  if (format) {
    result = _formatter(isCallable(format) ? format.call(field, value) : format, field, options);
  }

  return localizer(result, field, options);
}

export default class Field extends Element {
  static FORM_TYPE = 'field';
  static FIELD_TYPE_STRING = 'string';
  static FIELD_TYPE_NUMBER = 'number';
  static FIELD_TYPE_BOOLEAN = 'boolean';
  static FIELD_TYPE_DATE = 'date';

  static acceptOptions(options: Record<string, any> = {}) {
    const { localizer = noop, stringFormatter = noop, dateTimeFormatter = noop } = options;

    plug(LOCALIZER, localizer);
    plug(STRING_FORMATTER, stringFormatter);
    plug(DATE_TIME_FORMATTER, dateTimeFormatter);
  }

  static accept(schema: any) {
    const type: FieldType = schema.type
      ? (Field as any)[`FIELD_TYPE_${schema.type.toUpperCase()}`]
      : Field.FIELD_TYPE_STRING;

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
  readonly value!: FieldValue;

  protected _d!: FieldData;

  raw!: string;

  constructor(schema: FieldSchema, parent?: Element) {
    super(schema, parent);

    const accepted = Field.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`[Schema error] ${accepted.reason}`, accepted.infos));
    }

    const { type, rules, inputType = 'text', default: defu } = schema;

    def(this, 'formType', Field.FORM_TYPE);
    def(this, 'type', type);
    def(this, 'inputType', inputType);
    def(this, 'validation', new Validation(normalizeRules(rules, this.props, this.type, this, { field: this })));

    const typi = typing[this.type];

    if (typi.rule && !(typi.rule.name in this.validation)) {
      this.validation.addRule(typi.rule);
    }

    const hasDefault = !isUndefined(defu);
    def(this, 'default', hasDefault ? defu : null);

    const value = !isUndefined(schema.value) ? schema.value : defu;

    const formatted = ref(null);
    const raw = ref('');
    const typed = ref(null);

    getter(this, 'value', typed);

    setter(this, 'raw', raw, this.setRaw);

    getter(this, 'formatted', formatted);
    getter(this, 'error', this.getError);
    getter(this, 'checked', this.isChecked);

    this._d.raw = raw;
    this._d.typed = typed;
    this._d.formatted = formatted;

    this.setCheckValue(schema);

    if (!isUndefined(value)) {
      this.setValue(value);
    }

    this.emit('created', this);
  }

  async setRaw(val: any) {
    await this.setValue(val);
  }

  async setValue(val: any) {
    this._d.raw.value = toString(val);

    await this.validate();

    return this.value;
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

    return !isUndefined(checkValue) && toString(this.value) === checkValue;
  }

  isValid() {
    return !this._d.invalidated && this.validation.valid;
  }

  reset() {
    this._d.raw.value = this.default !== null ? this.default : '';
    this.cleanUp();
    this.validation.reset();
  }

  async clear() {
    this.cleanUp();

    await this.setRaw('');
  }

  getHtmlName(): string {
    return genHtmlName(this, this._d.ancestors);
  }

  async validate() {
    const raw = this.raw;
    const typi = typing[this.type];
    let castingRule: Rule = dumpRule;
    const typed = this._d.typed;
    const { format, formatOptions } = this._d.schema;

    this.emit('validate', this);

    if (typi.rule) {
      castingRule = (this.validation as ExtValidation<any>)[typi.rule.name];
    }

    const { valid } = await castingRule.validate(raw);

    if (valid) {
      const value = typi.cast(raw);
      const { valid } = await this.validation.validate(value, { excluded: [castingRule.name] });

      typed.value = valid ? value : null;
    } else {
      typed.value = null;
    }

    this._d.formatted.value = formatter(this, format, formatOptions);

    this.emit('validated', this);
  }
}
