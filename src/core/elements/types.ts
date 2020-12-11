import { PropValue, ValidationRuleSchema } from '../../types';

export interface FormElementSchema {
  readonly formId: PropValue<string>;
  model?: string;
}

export interface FormElementData {
  ancestors: any[] | null;
  invalidated: boolean;
}

export interface FormGroupSchema extends FormElementSchema {
  formType: 'group';
  fields: FormElementSchema[];
  props?: Record<string, any>;
  rules?: Record<string, ValidationRuleSchema>;
}

export interface FormGroupsSchema extends FormElementSchema {
  formType: 'groups';
  group: Omit<FormGroupSchema, 'formId' | 'formType'>;
  props?: Record<string, any>;
  rules?: Record<string, ValidationRuleSchema>;
}

export type FormSchema = FormGroupSchema;

export type FormFieldType = 'string' | 'number' | 'boolean' | 'date';
export type FormFieldValue = string | number | boolean | Date | null;

export type Formatter = (value: FormFieldValue) => string;

export interface FormFieldSchema extends FormElementSchema {
  formType: 'field';
  type: FormFieldType;
  inputType?: string;
  label?: string;
  hint?: string;
  help?: string;
  placeholder?: string;
  options?: any[];
  formatter?: Formatter;
  id?: string;
  default?: string;
  value?: FormFieldValue | FormFieldValue[];
  props?: Record<string, any>;
  rules?: Record<string, ValidationRuleSchema>;
}
