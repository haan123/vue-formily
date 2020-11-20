import {
  FormContainer,
  FormElement,
  FormElementData,
  FormElementSchema,
  FormilySchemas,
  SchemaValidation,
  ValidationResult
} from '.';

export type Formatter = (this: FormField, value: FormField['value']) => string;

export type FormFieldValidationResult = ValidationResult & {
  value: FormField['value'];
};

export interface FormFieldSchema extends FormElementSchema {
  formType: 'field';
  type: FormField['type'];
  inputType?: string;
  label?: string;
  hint?: string;
  help?: string;
  placeholder?: string;
  options?: any[];
  formatter?: Formatter;
  id?: string;
  default?: string;
  value?: FormField['value'] | FormField['value'][];
  props?: Record<string, any>;
}

export declare class FormField extends FormElement {
  constructor(schema: FormFieldSchema, parent?: FormContainer);

  static accept(schema: any): SchemaValidation;
  static create(schema: any, ...args: any[]): FormField;

  readonly formType: 'field';
  readonly type: 'string' | 'number' | 'boolean' | 'date';
  readonly inputType: string;
  readonly default: FormField['value'];
  readonly props: Record<string, any> | null;
  readonly model: string;
  readonly formatted: string | null;
  pending: boolean;
  raw: string | null;
  value: string | number | boolean | Date | null;

  getHtmlName(): string | null;
  isValid(): boolean;
  initialize(schema: FormilySchemas, parent: FormContainer | null, data: FormElementData, ...args: any[]): void;

  validate(val: any): Promise<FormFieldValidationResult>
}
