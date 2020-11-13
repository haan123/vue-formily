import { FormContainer, FormElement, FormFieldSchema, PropValue, SchemaValidation } from '.';

export type FormFieldValue = string | number | boolean | Date | null;
export type FormFieldType = 'string' | 'number' | 'boolean' | 'date';

export declare class FormField extends FormElement {
  constructor(schema: FormFieldSchema, parent?: FormContainer);

  static accept(schema: any): SchemaValidation;
  static create(schema: any, ...args: any[]): FormField;

  readonly type: FormFieldType;
  readonly inputType: string;
  readonly default: FormFieldValue;
  readonly props: Record<string, PropValue> | null;
  readonly model: string;
  pending: boolean;
  raw: string | null;
  formatted: string | null;
  value: FormFieldValue;

  genHtmlName(path: string[], ...args: any[]): string;
  isValid(): boolean;
}
