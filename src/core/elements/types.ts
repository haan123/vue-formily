import { PropValue, RuleSchema } from '../../types';

export interface ElementSchema {
  formId: PropValue<string>;
  model?: string;
  props?: Record<string, PropValue<any>>;
}

export interface ElementData {
  ancestors: any[] | null;
  timer: number | null;
}

export type FieldSchemas = FieldSchema | GroupSchema | CollectionSchema;

export interface GroupSchema extends ElementSchema {
  fields: FieldSchemas[];
  rules?: RuleSchema[];
}

export interface CollectionSchema extends ElementSchema {
  group: Omit<GroupSchema, 'formId'>;
  rules?: RuleSchema[];
}

export type FormSchema = GroupSchema;

export type FieldType = 'string' | 'number' | 'boolean' | 'date';
export type FieldValue = string | number | boolean | Date | null;

export type Formatter = (value: FieldValue) => string;

export interface FieldSchema extends ElementSchema {
  type: FieldType;
  inputType?: string;
  format?: Formatter;
  default?: string | number | boolean;
  value?: string | number | boolean;
  rules?: RuleSchema[];
  checkedValue?: string;
}
