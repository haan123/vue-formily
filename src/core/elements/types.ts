import { ValidationRuleSchema } from '../../types';
import { EventHandler } from '../Evento';
import { Validation } from '../validations';

export interface ElementSchema {
  formId?: string;
  model?: string;
  props?: Record<string, any>;
  on?: Record<string, EventHandler>;
  options?: Record<string, any>;
}

export interface ElementData {
  ancestors: any[] | null;
  schema: any;
  validation: Validation;
}

export interface GroupSchema extends ElementSchema {
  fields: (FieldSchema | GroupSchema | CollectionSchema)[];
  rules?: ValidationRuleSchema[];
}

export interface CollectionSchema extends ElementSchema {
  group: Omit<GroupSchema, 'formId'>;
  rules?: ValidationRuleSchema[];
}

export type FormSchema = GroupSchema;

export type FieldType = 'string' | 'number' | 'boolean' | 'date';
export type FieldValue = string | number | boolean | Date | null;

export type Format = string | ((field: any) => string);

export interface FieldSchema extends ElementSchema {
  type?: FieldType;
  inputType?: string;
  format?: Format;
  default?: any;
  value?: any;
  rules?: ValidationRuleSchema[];
  checkedValue?: any;
}
