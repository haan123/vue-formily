import {
  FormGroupSchema,
  FormGroup,
  FormContainer,
  SchemaValidation,
  FormElementSchema,
  FormElement,
  FormGroupsItem,
  FormElementData,
  FormilySchemas
} from '.';

export interface FormGroupsSchema extends FormElementSchema {
  formType: Pick<FormGroups, 'formType'>;
  group: Omit<FormGroupSchema, 'formId' | 'formType'>;
  props?: Record<string, any>;
}

export declare class FormGroups extends FormElement {
  private constructor(schema: FormGroupSchema, parent?: FormContainer);

  static accept(schema: any): SchemaValidation;
  static create(schema: any, ...args: any[]): FormGroups;

  readonly _schema: FormGroupSchema;
  readonly formType: 'groups';
  readonly props: Record<string, any> | null;

  groups: FormGroupsItem[] | null;
  value: Exclude<FormGroup['value'], null>[] | null;

  getHtmlName(): string | null;
  isValid(): boolean;
  initialize(schema: FormilySchemas, parent: FormContainer | null, data: FormElementData, ...args: any[]): void;

  addGroup(): void;

}
