import {
  FormElement,
  FormElementData,
  FormElementSchema,
  FormilyElements,
  FormilySchemas,
  SchemaValidation,
  ValidationResult
} from '.';

export interface FormGroupSchema extends FormElementSchema {
  formType: FormGroup['formType'];
  fields: FormilySchemas[];
  props?: Record<string, any>;
}

export declare class FormGroup extends FormElement {
  constructor(schema: FormGroupSchema, parent: any);

  static accept(schema: any): SchemaValidation;
  static create(schema: any, ...args: any[]): FormGroup;

  readonly formType: 'group';
  readonly type: 'enum';
  readonly props: Record<string, any> | null;
  fields: FormilyElements[];

  getHtmlName(): string | null;
  isValid(): boolean;
  initialize(schema: FormilySchemas, parent: any, data: FormElementData, ...args: any[]): void;

  getField(path: string | string[], fields?: FormilyElements[]): FormilyElements | null;
  validate(val: any): Promise<ValidationResult>;
}
