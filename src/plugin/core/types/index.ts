import { FormField, FormFieldSchema } from './FormField';
import { FormGroups, FormGroupsSchema } from './FormGroups';
import { FormGroup, FormGroupSchema } from './FormGroup';
import { Form } from './Form';
import { Forms } from './Forms';
import { Validation, ValidationProps } from './Validation';
import { ValidationRuleSchema } from './ValidationRule';
import { FormElement } from './FormElement';
import FormGroupsItem from '../FormGroupsItem';

declare module 'vue/types/vue' {
  interface Vue {
    $formily: {
      add: (formSchema: FormSchema, options?: FormilyOptions) => Form;
    };
    forms: Forms;
  }
}

export type HtmlNameTemplate = {
  formType: string;
  keys?: (formElement: FormilyElements, parentKeys: string[]) => string[];
  template?: (keyPath: string[]) => string;
};

export type Validations = {
  [name: string]: Validation;
};

export interface ValidationMessageGenerator {
  (value: any, props: ValidationProps, data: Map<string, any> | null): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export interface FormElementConstructor extends Function {
  accept(schema: any): SchemaValidation;
  create(schema: any, ...args: any[]): FormilyElements;
}

export type SchemaValidation = {
  valid: boolean;
  reason?: string;
  infos?: Record<string, string>;
};

export type FormSchema = FormGroupSchema;

export interface FormContainer extends FormElement {
  sync: (field: FormilyElements) => void;
}

export type FormilySchemas = FormFieldSchema | FormGroupSchema | FormGroupsSchema;

export type FormilyElements = FormField | FormGroup | FormGroups | FormGroupsItem;

export interface FormilyOptions {
  name?: string;
  rules: Record<string, ValidationRuleSchema>;
}

export * from './Validation';
export * from './ValidationRule';
export * from './FormElement';
export * from './FormField';
export * from './FormGroup';
export * from './FormGroups';
export * from './FormGroupsItem';
export * from './Form';
export * from './ValidationRule';
