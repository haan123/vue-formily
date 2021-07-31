import { ElementData, FieldSchema, FieldType, FieldValue, Format } from './types';

import Element from './Element';
import {
  logMessage,
  isCallable,
  isUndefined,
  toString,
  noop,
  isNumber,
  isDateObject,
  readonlyDumpProp
} from '../../utils';
import Validation from '../validations/Validation';
import { normalizeRules, indentifySchema, invalidateSchemaValidation, getPlug } from '../../helpers';
import { DATE_TIME_FORMATTER, LOCALIZER, STRING_FORMATTER, NUMBER_FORMATTER } from '../../constants';

type FieldData = ElementData & {
  error: string | null;
  raw: any;
  typed: FieldValue;
  checkedValue: any;
  formatted: string | null;
  pending: boolean;
};

const typing: Record<
  string,
  {
    cast: (value: any, ...args: any[]) => FieldValue;
    formatter?: string;
  }
> = {
  string: {
    cast(value: any) {
      return value !== null ? toString(value) : null;
    },
    formatter: STRING_FORMATTER
  },
  number: {
    cast(value: any) {
      return isNumber(value) ? +value : null;
    },
    formatter: NUMBER_FORMATTER
  },
  boolean: {
    cast(value: any) {
      return !!(value === true || value === 'true');
    }
  },
  date: {
    cast(value: any) {
      const date = new Date(value);

      return isDateObject(date) ? date : null;
    },
    formatter: DATE_TIME_FORMATTER
  }
};

function formatter(field: Field, format?: Format, options?: Record<string, any>): string {
  const { type, raw, value } = field;
  const _formatter = getPlug(typing[type].formatter || '') || noop;
  const localizer = getPlug(LOCALIZER) || noop;
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

  static create(schema: FieldSchema, ...args: any[]): Field {
    return new Field(schema, ...args);
  }

  readonly formType!: string;
  readonly type!: FieldType;
  readonly inputType!: string;
  readonly default!: any;

  protected _d!: FieldData;

  constructor(schema: FieldSchema, parent?: Element | null) {
    super(schema, parent);

    const accepted = Field.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`[Schema error] ${accepted.reason}`, accepted.infos));
    }

    const { type, rules, inputType = 'text', default: defu } = schema;

    readonlyDumpProp(this, 'formType', Field.FORM_TYPE);
    readonlyDumpProp(this, 'type', type);
    readonlyDumpProp(this, 'inputType', inputType);

    this._d.validation = new Validation(normalizeRules(rules, this.type));

    const hasDefault = !isUndefined(defu);
    readonlyDumpProp(this, 'default', hasDefault ? defu : null);

    const value = !isUndefined(schema.value) ? schema.value : defu;

    const data = this._d;

    data.typed = null;
    data.formatted = null;
    data.pending = false;

    this.setCheckedValue(schema.checkedValue);

    if (!isUndefined(value)) {
      this.setValue(value);
    } else {
      data.raw = '';
    }
  }

  get pending() {
    return this._d.pending;
  }

  get formatted() {
    return this._d.formatted;
  }

  get raw() {
    return this._d.raw;
  }

  set raw(value: any) {
    this.setRaw(value);
  }

  async setRaw(value: any) {
    await this.setValue(value);
  }

  get value() {
    return this._d.typed;
  }

  set value(value: any) {
    this.setValue(value);
  }

  async setValue(value: any) {
    const _d = this._d;
    const curRaw = _d.raw;
    const raw = (_d.raw = toString(value));

    if (raw !== curRaw) {
      await this.validate();

      this.emit('changed', this, curRaw, raw);
    }

    return this.value;
  }

  setCheckedValue(checkedValue: any) {
    this._d.checkedValue = checkedValue;
  }

  get checked() {
    const { checkedValue } = this._d;

    if (this.type === Field.FIELD_TYPE_BOOLEAN) {
      return this.value;
    }

    return !isUndefined(checkedValue) && toString(this.value) === checkedValue;
  }

  isValid() {
    return this.validation.valid;
  }

  reset() {
    this._d.raw = this.default !== null ? this.default : '';
    this.cleanUp();
    this.validation.reset();
  }

  async clear() {
    this.cleanUp();

    await this.setValue('');
  }

  async validate() {
    const raw = this.raw;
    const typi = typing[this.type];
    const data = this._d;
    const { format, formatOptions } = data.schema;

    data.pending = true;

    this.emit('validate', this);

    const typed = typi.cast(raw);
    const { valid } = await this.validation.validate(typed, {}, this);

    data.typed = typed !== null && valid ? typed : null;
    data.formatted = formatter(this, format, formatOptions);
    data.pending = false;

    this.emit('validated', this);
  }
}
