import { FieldSchema, GenericFieldType, FormilyField, FieldValue } from '../types';
import Field from './Field'
import Form from './Form';
import { genInputName, genId } from './Field';
import { readOnlyDef } from '../utils';

const converters: {
  [key: string]: any
} = {
  string: function (value: any = '') { return '' + value },
  number: function (value: any = 0) { return +value },
  boolean: function (value: any = false) { return !!value },
  date: function (value: any) { return value ? new Date(value) : new Date() },
  'set-of-string': function (value: any) { return Array.isArray(value) ? value : [this.string(value)] },
  'set-of-number': function (value: any) { return Array.isArray(value) ? value : [this.number(value)] },
  'enum-of-string': function (value: any) { return Array.isArray(value) ? value : [this.string(value)] },
  'enum-of-number': function (value: any) { return Array.isArray(value) ? value : [this.number(value)] },
}

export default class GenericField extends Field  {
  readonly type!: GenericFieldType;
  readonly inputName!: string;
  readonly id!: string;
  readonly value!: FieldValue;

  constructor(fieldSchema: FieldSchema, form: Form, parent: (FormilyField | null)) {
    super(fieldSchema, form, parent);

    readOnlyDef(this, 'inputName', genInputName(this));
    readOnlyDef(this, 'id', fieldSchema.id || genId(this));
    readOnlyDef(this, 'type', fieldSchema.type as GenericFieldType || 'string');
    readOnlyDef(this, 'value', this.set(fieldSchema.value));
  }

  set(value: any): FieldValue {
    const typing = converters[this.type]
    value = typing.call(this, value)

    return value
  }
}
