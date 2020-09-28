import GenericField from './core/GenericField';
import CollectionField from './core/CollectionField';
import Form from './core/Form';

declare module 'vue/types/vue' {
  interface Vue {
    $formily: {
      add: (schema: FormilyFieldSchema[], options?: FormilyOptions) => Form
    }
  }
}

export type StringOrNumber = string | number;

export type FieldValue = StringOrNumber | boolean;

export type GenericFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'set-of-string'
  | 'set-of-number'
  | 'enum-of-string'
  | 'enum-of-number';

export type CollectionFieldType =
  | 'collection'
  | 'nested';

export type FormilyFieldType = GenericFieldType | CollectionFieldType

export type FormilyFieldSchema = FieldSchema | CollectionFieldSchema;

export type FieldSchema = {
  name: string;
  id?: string;
  value?: FieldValue;
  type: FormilyFieldType;
  label?: string;
  hint?: string;
  options?: any[];
  inputType?: string;
  placeholder?: string;
  collection?: boolean;
  nested?: boolean;
  validations?: any;
  formatter?: () => FieldValue;
  [key: string]: any;
};

export type CollectionFieldSchema = FieldSchema & {
  fields: FormilyFieldSchema[];
};

export type FormilyField = GenericField | CollectionField;

export interface FormilyOptions {
  name?: string;
}
