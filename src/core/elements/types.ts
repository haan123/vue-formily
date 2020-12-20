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

export type FieldSchemas = FieldSchema | GroupSchema | CollectionSchema;

export interface GroupSchema extends ElementSchema {
  formType: 'group';
  fields: FieldSchemas[];
  rules?: Record<string, ValidationRuleSchema>;
}

export interface CollectionSchema extends ElementSchema {
  formType: 'groups';
  group: Omit<GroupSchema, 'formId' | 'formType'>;
  rules?: Record<string, ValidationRuleSchema>;
}

export type FormSchema = GroupSchema;

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
