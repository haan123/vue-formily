import { FormElement, FormFieldSchema, FormilyField, PropValue, Validation } from '.';

export type FormFieldValue = string | number | boolean | Date | null;
export type FormFieldType = 'string' | 'number' | 'boolean' | 'date';

export declare class FormField extends FormElement {
  constructor(schema: FormFieldSchema, parent?: FormilyField);

  static accept(schema: any): schema is FormFieldSchema;
  static create(schema: any, ...args: any[]): FormField;

  initialize(schema: FormFieldSchema, ...args: any[]): void;
  genHtmlName(path: string[], ...args: any[]): string;
  isValid(): boolean;

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
