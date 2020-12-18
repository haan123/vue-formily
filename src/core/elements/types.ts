import { PropValue, ValidationRuleSchema } from '../../types';

export interface ElementSchema {
  formId: PropValue<string>;
  model?: string;
  props?: Record<string, PropValue<any>>;
}

export interface ElementData {
  ancestors: any[] | null;
  invalidated: boolean;
}

export type FieldsSchema = FieldSchema | Collectionchema | CollectionSchema;

export interface Collectionchema extends ElementSchema {
  formType: 'group';
  fields: FieldsSchema[];
  rules?: Record<string, ValidationRuleSchema>;
}

export interface CollectionSchema extends ElementSchema {
  formType: 'groups';
  group: Omit<Collectionchema, 'formId' | 'formType'>;
  rules?: Record<string, ValidationRuleSchema>;
}

export type FormSchema = Collectionchema;

export type FieldType = 'string' | 'number' | 'boolean' | 'date';
export type FieldValue = string | number | boolean | Date | null;

export type Formatter = (value: FieldValue) => string;

export interface FieldSchema extends ElementSchema {
  formType: 'field';
  type: FieldType;
  inputType?: string;
  format?: Formatter;
  default?: FieldValue;
  value?: FieldValue;
  rules?: Record<string, ValidationRuleSchema>;
}
