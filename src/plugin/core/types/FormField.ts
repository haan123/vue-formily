import { FormFieldSchema, FormilyField } from '.';
import { FormElement } from './FormElement';

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
  label: string | null;
  hint: string | null;
  help: string | null;
  placeholder: string | null;
  options: any[] | null;
  readonly formatter?: () => FormFieldValue;
  raw: string | null;
  formatted: string | null;
  value: FormFieldValue;

  // setValue(value: any): any;
}
