import { ElementData, FieldSchema, FieldType, FieldValue } from './types';

import Element from './Element';
import { logMessage, isCallable, isUndefined, toString, isNumber, isDateObject, readonlyDumpProp } from '../../utils';
import Validation from '../validations/Validation';
import { normalizeRules, getSchemaAcceptance, invalidateSchemaValidation, getPlug, acceptSchema } from '../../helpers';
import { DATE_TIME_FORMATTER, LOCALIZER, STRING_FORMATTER, NUMBER_FORMATTER } from '../../constants';

type FieldData = ElementData & {
  error: string | null;
  raw: string;
  typed: FieldValue;
  checkedValue: any;
  formatted: string | null;
  pending: boolean;
};

const FORM_TYPE = 'field';
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

function formatter(this: Field): string {
  const { type, _d: data } = this;
  const { format, options = {} } = data.schema;
  const _FORMATER = typing[type].formatter as string;
  const formatter = getPlug(_FORMATER);
  const translater = getPlug(LOCALIZER);
  let result = null;

  if (format && formatter) {
    const formatting = isCallable(format) ? format.call(this, this) : format;
    const translated = translater ? translater.translate(formatting, this, options) : formatting;

    result = formatter.format(translated, this, options[_FORMATER]);
  }

  return result;
}

export default class Field extends Element {
  static FORM_TYPE = FORM_TYPE;
  static FIELD_TYPE_STRING = 'string';
  static FIELD_TYPE_NUMBER = 'number';
  static FIELD_TYPE_BOOLEAN = 'boolean';
  static FIELD_TYPE_DATE = 'date';

  static accept(schema: any) {
    const { type: schemaType, formId } = schema;
    const type: FieldType = schemaType ? (Field as any)[`FIELD_TYPE_${schemaType.toUpperCase()}`] : 'string';

    const { accepted, sv } = getSchemaAcceptance(schema, type);

    if (!accepted) {
      if (!type) {
        invalidateSchemaValidation(sv, 'Invalid `type`', { formId });
      }

      if (sv.valid) {
        acceptSchema(schema, type);
      }
    }

    return sv;
  }

  static create(schema: FieldSchema, parent?: Element | null): Field {
    return new Field(schema, parent);
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

    readonlyDumpProp(this, 'formType', FORM_TYPE);
    readonlyDumpProp(this, 'type', type || 'string');
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

    data.pending = true;

    this.emit('validate', this);

    const typed = typi.cast(raw);
    const { valid } = await this.validation.validate(typed, {}, this.props, this);

    data.typed = typed !== null && valid ? typed : null;
    data.formatted = formatter.call(this);
    data.pending = false;

    this.emit('validated', this);
  }
}
