import { FormContainer, FormElement, FormFieldSchema, FormilyFieldSchema, PropValue } from '.';

export type FormFieldValue = string | number | boolean | Date | null;
export type FormFieldType = 'string' | 'number' | 'boolean' | 'date';

export declare class FormField extends FormElement {
  constructor(schema: FormFieldSchema, parent?: FormContainer);

  static accept(schema: any): schema is FormFieldSchema;
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

  initialize(schema: FormilyFieldSchema, ...args: any[]): void;
  genHtmlName(path: string[], ...args: any[]): string;
  isValid(): boolean;
}
