import Vue, { VNode } from 'vue';
import Field from './Field';
import CollectionField from './CollectionField';

export type StringOrNumber = string | number;

type _FieldBase = {
  name: string;
  id?: string;
  value?: FieldValue;
  type: FieldType;
  label?: string;
  hint?: string;
  options?: any[];
  inputType?: string;
  placeholder?: string;
  collection?: boolean;
  nested?: boolean;
  formatter?: () => FieldValue;
  [key: string]: any;
};

export type FieldValue = StringOrNumber | boolean;

export type FieldType = 'string' | 'number' | 'boolean' | 'date';

export type CollectionFieldType = 'set-of-string' | 'set-of-number' | 'enum-of-string' | 'enum-of-number' | null;

export type FormilyFieldSchema = FieldSchema | CollectionFieldSchema;

export type FieldSchema = _FieldBase & {
  validations: any;
};

export type CollectionFieldSchema = FieldSchema & {
  fields: (FieldSchema | CollectionFieldSchema)[];
};

export type FormilyField = Field & {
  fields?: (Field | CollectionField)[];
};

export interface FormilyOptions {
  name?: string;
}
