import {
  FormContainer,
  FormElement,
  FormElementData,
  FormElementSchema,
  FormilyElements,
  FormilySchemas,
  SchemaValidation,
  ValidationResult
} from '.';

export type FormGroupValue = Record<string, any> | null;

export interface FormGroupSchema extends FormElementSchema {
  formType: Pick<FormGroup, 'formType'>;
  fields: FormilySchemas[];
  props?: Record<string, any>;
}

export declare class FormGroup extends FormElement {
  constructor(schema: FormGroupSchema, parent: FormContainer | null);

  static accept(schema: any): SchemaValidation;
  static create(schema: any, ...args: any[]): FormGroup;

  readonly formType: 'group';
  readonly props: Record<string, any> | null;
  fields: FormilyElements[];
  value: FormGroupValue;

  getHtmlName(): string | null;
  isValid(): boolean;
  initialize(schema: FormilySchemas, parent: FormContainer | null, data: FormElementData, ...args: any[]): void;

  getField(path: string | string[], fields?: FormilyElements[]): FormilyElements | null;
  validate(val: any): Promise<ValidationResult>;
  sync(field: FormilyElements): void;
}
