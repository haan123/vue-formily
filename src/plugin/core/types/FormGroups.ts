import { FormGroupSchema, FormilyField, FormGroup, FormGroupsSchema, FormContainer } from '.';
import { FormElement } from './FormElement';

export declare class FormGroups extends FormElement {
  private constructor(schema: FormGroupSchema, parent?: FormContainer);

  static accept(schema: any): schema is FormGroupsSchema;
  static create(schema: any, ...args: any[]): FormGroups;

  initialize(schema: FormGroupsSchema, ...args: any[]): void;
  genHtmlName(path: string[], ...args: any[]): string;
  isValid(): boolean;

  readonly _schema: FormGroupSchema;

  groups: FormGroup[];
  value: any[];

  addGroup(): void;

  _sync(field: FormilyField): void;
}
