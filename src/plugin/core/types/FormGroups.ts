import { FormGroupSchema, FormilyField, FormGroup, FormContainer, PropValue, SchemaValidation } from '.';
import { FormElement } from './FormElement';

export type FormGroupsType = 'groups';

export declare class FormGroups extends FormElement {
  private constructor(schema: FormGroupSchema, parent?: FormContainer);

  static accept(schema: any): SchemaValidation;
  static create(schema: any, ...args: any[]): FormGroups;

  readonly _schema: FormGroupSchema;
  readonly type: FormGroupsType;
  readonly props: Record<string, PropValue> | null;

  groups: FormGroup[] | null;
  value: Record<string, any>[] | null;

  addGroup(): void;

  _sync(field: FormilyField): void;
  genHtmlName(path: string[], ...args: any[]): string;
  isValid(): boolean;
}
