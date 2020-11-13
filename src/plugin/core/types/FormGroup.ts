import { FormContainer, FormElement, FormGroupSchema, FormilyField, PropValue, SchemaValidation } from '.';

export type FormGroupType = 'group';

export declare class FormGroup extends FormElement {
  constructor(schema: FormGroupSchema, parent?: FormContainer);

  static accept(schema: any): SchemaValidation;
  static create(schema: any, ...args: any[]): FormGroup;

  readonly index: number | null;
  readonly type: FormGroupType;
  readonly props: Record<string, PropValue> | null;
  fields: FormilyField[];
  value: Record<string, any> | null;

  genHtmlName(path: string[], ...args: any[]): string;
  isValid(): boolean;

  getField(path: string | string[], fields?: FormilyField[]): FormilyField | null;
  _sync(field: FormilyField): void;
}
