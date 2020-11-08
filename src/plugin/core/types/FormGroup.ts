import { FormContainer, FormElement, FormGroupSchema, FormilyField } from '.';

export declare class FormGroup extends FormElement {
  constructor(schema: FormGroupSchema, parent?: FormContainer);

  static accept(schema: any): schema is FormGroupSchema;
  static create(schema: any, ...args: any[]): FormGroup;

  readonly index: number | null;
  fields: FormilyField[];
  value: Record<string, any> | null;

  initialize(schema: FormGroupSchema, ...args: any[]): void;
  genHtmlName(path: string[], ...args: any[]): string;
  isValid(): boolean;

  getField(path: string | string[], fields?: FormilyField[]): FormilyField | null;
  _sync(field: FormilyField): void;
}
