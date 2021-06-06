import { PropValue, ValidationRuleSchema } from '../../types';
import { EventHandler } from '../Evento';

export interface ElementSchema {
  formId: PropValue<string>;
  model?: string;
  props?: Record<string, PropValue<any>>;
  on?: Record<string, EventHandler>;
}

export interface ElementData {
  ancestors: any[] | null;
  invalidated: boolean;
  error: string | null;
  schema: any;
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
  type?: FieldType;
  inputType?: string;
  format?: Format;
  default?: any;
  value?: any;
  rules?: ValidationRuleSchema[];
  checkValue?: PropValue<any>;
  locale?: string;
  formatOptions?: Record<string, any>;
}
