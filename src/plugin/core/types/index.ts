import { FormField, FormFieldValue, FormFieldType } from './FormField';
import { FormGroups } from './FormGroups';
import { FormGroup } from './FormGroup';
import { Form } from './Form';
import { Forms } from './Forms';
import { Validation, ValidationProps } from './Validation';
import { ValidationRule } from './ValidationRule';

declare module 'vue/types/vue' {
  interface Vue {
    $formily: {
      add: (formSchema: FormSchema, options?: FormilyOptions) => Form;
    };
    forms: Forms;
  }
}

export type FormElementSchema = {
  readonly formId: string;
  rules?: Record<string, ValidationRuleSchema>;
  model?: string;
};

export type Validations = {
  [name: string]: Validation;
};

export type Validator = (
  value: any,
  props: ValidationProps,
  data: Map<string, any> | null
) => boolean | Promise<boolean>;
export interface RuleSchema {
  validate?: Validator;
  validatable?: (this: ValidationRule, form: Form, vm: Vue) => boolean;
  types?: FormFieldType[];
  props?: Record<string, PropValue>;
  message?: ValidationMessageTemplate;
  cascade?: boolean;
  inherit?: boolean;
  allowEmpty?: boolean;
}

export type ValidationRuleSchema = Validator | RuleSchema;
export interface ValidationMessageGenerator {
  (value: any, props: ValidationProps, data: Map<string, any> | null): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export type PropValue = FormFieldValue | ((this: FormField, value: any) => FormFieldValue);

export interface FormElementConstructor extends Function {
  accept(schema: any): boolean;
  create(schema: any, ...args: any[]): FormilyField;
}
export type Formatter = (this: FormField, value: FormFieldValue) => string;

export interface FormFieldSchema extends FormElementSchema {
  type: FormFieldType;
  inputType?: string;
  label?: string;
  hint?: string;
  help?: string;
  placeholder?: string;
  options?: any[];
  formatter?: Formatter;
  id?: string;
  default?: string;
  value?: FormFieldValue | FormFieldValue[];
  props?: Record<string, PropValue>;
}

export interface FormGroupSchema extends FormElementSchema {
  fields: FormilyFieldSchema[];
  props?: Record<string, PropValue>;
}

export interface FormSchema extends FormGroupSchema {
  fields: FormilyFieldSchema[];
}

export interface FormGroupsSchema extends FormElementSchema {
  group: Omit<FormGroupSchema, 'formId'>;
  props?: Record<string, PropValue>;
}

export type FormContainer = FormGroup | FormGroups;

export type FormilyFieldType = FormFieldType;

export type FormilyFieldSchema = FormFieldSchema | FormGroupSchema | FormGroupsSchema;

export type FormilyField = FormField | FormGroup | FormGroups;

export interface FormilyFieldConstructor extends Function {
  accept(schema: any): boolean;
  create(schema: any, ...args: any[]): FormilyField;
}

export interface FormilyOptions {
  name?: string;
  rules: Record<string, ValidationRuleSchema>;
}

export { Validation, ValidationResult, ValidationOptions, ValidationProps } from './Validation';
export { ValidationRule } from './ValidationRule';
export { FormElement } from './FormElement';
export { FormField, FormFieldValue, FormFieldType } from './FormField';
export { FormGroup } from './FormGroup';
export { FormGroups } from './FormGroups';
export { Form } from './Form';
