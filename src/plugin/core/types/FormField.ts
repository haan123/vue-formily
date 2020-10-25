import { FormElement, FormFieldSchema, FormilyField, PropValue, Validation } from '.';

export type FormFieldValue = string | number | boolean | Date | null;
export type FormFieldType = 'string' | 'number' | 'boolean' | 'date';

export declare class FormField extends FormElement {
  constructor(schema: FormFieldSchema, parent?: FormilyField);

  static FIELD_TYPE_STRING: FormFieldType;
  static FIELD_TYPE_NUMBER: FormFieldType;
  static FIELD_TYPE_BOOLEAN: FormFieldType;
  static FIELD_TYPE_DATE: FormFieldType;

  readonly type: FormFieldType;
  readonly inputType: string;
  readonly default: FormFieldValue;
  readonly props?: Record<string, PropValue>;
  readonly options?: any[];
  readonly valiadtion?: Validation;
  raw: string | null;
  formatted: string | null;
  value: FormFieldValue;
}
