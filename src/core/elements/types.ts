import { PropValue, ValidationRuleSchema } from '../../types';

export interface ElementSchema {
  formId: PropValue<string>;
  model?: string;
  props?: Record<string, PropValue<any>>;
}

export interface ElementData {
  ancestors: any[] | null;
  timer: number | null;
  invalidated: boolean;
}

export type FieldSchemas = FieldSchema | GroupSchema | CollectionSchema;

export interface GroupSchema extends ElementSchema {
  fields: FieldSchemas[];
  rules?: ValidationRuleSchema[];
}

export interface CollectionSchema extends ElementSchema {
  group: Omit<GroupSchema, 'formId'>;
  rules?: ValidationRuleSchema[];
}

export type FormSchema = GroupSchema;

export type FieldType = 'string' | 'number' | 'boolean' | 'date';
export type FieldValue = string | number | boolean | Date | null;

export type Format = string | ((value: FieldValue) => string);

export interface FieldSchema extends ElementSchema {
  type: FieldType;
  inputType?: string;
  format?: Format;
  default?: any;
  value?: FieldValue;
  rules?: ValidationRuleSchema[];
  checkedValue?: string;
  locale?: string;
}
