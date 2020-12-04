import {
  FormGroupSchema,
  SchemaValidation,
  FormElementSchema,
  FormElement,
  FormGroupsItem,
  FormElementData,
  FormilySchemas
} from '.';

export interface FormGroupsSchema extends FormElementSchema {
  formType: FormGroups['formType'];
  group: Omit<FormGroupSchema, 'formId' | 'formType'>;
  props?: Record<string, any>;
}

export declare class FormGroups extends FormElement {
  private constructor(schema: FormGroupSchema, parent: any);

  static accept(schema: any): SchemaValidation;
  static create(schema: any, ...args: any[]): FormGroups;

  readonly _schema: FormGroupSchema;
  readonly formType: 'groups';
  readonly type: 'set';
  readonly props: Record<string, any> | null;

  groups: FormGroupsItem[] | null;

  getHtmlName(): string | null;
  isValid(): boolean;
  initialize(schema: FormilySchemas, parent: any, data: FormElementData, ...args: any[]): void;

  addGroup(): void;
}
