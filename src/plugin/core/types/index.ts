import { FormField, FormFieldValue, FormFieldType } from './FormField';
import { FormGroups, FormGroupsType } from './FormGroups';
import { FormGroup, FormGroupType } from './FormGroup';
import { Form } from './Form';
import { Forms } from './Forms';
import { Validation } from './Validation';

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
};

export type Validations = {
  [name: string]: Validation;
};

export type Validator = (value: any, ...args: any[]) => boolean | Promise<boolean>;
export interface RuleSchema {
  validate?: Validator;
  types?: FormFieldType[];
  props?: Record<string, PropValue>;
  message?: ValidationMessageTemplate;
  cascade?: boolean;
  inherit?: boolean;
}

export type ValidationRuleSchema = Validator | RuleSchema;
export interface ValidationMessageGenerator {
  (value: any, props?: Map<string, any>, data?: Map<string, any>): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export type PropValue = FormFieldValue | ((this: FormField, value: any) => FormFieldValue);

export interface FormFieldSchema extends FormElementSchema {
  type: FormFieldType;
  inputType?: string;
  label?: string;
  hint?: string;
  help?: string;
  placeholder?: string;
  options?: any[];
  formatter?: (this: FormField, value: FormFieldValue) => string;
  id?: string;
  default?: FormFieldValue;
  value?: FormFieldValue | FormFieldValue[];
  props?: Record<string, PropValue>;
}

export interface FormGroupSchema extends FormElementSchema {
  readonly type: FormGroupType;
  fields: FormilyFieldSchema[];
}

export interface FormSchema extends FormGroupSchema {
  readonly type: 'form';
  fields: FormilyFieldSchema[];
}

export interface FormGroupsSchema extends FormElementSchema {
  readonly type: FormGroupsType;
  fields: FormilyFieldSchema[];
}

export type FormilyFieldType = FormFieldType | 'groups' | 'group';

export type FormilyFieldSchema = FormFieldSchema | FormGroupSchema | FormGroupsSchema;

export type FormilyField = FormField | FormGroup | FormGroups;

export interface FormilyOptions {
  name?: string;
  rules: Record<string, ValidationRuleSchema>;
}

export { Validation, ValidationResult, ValidationOptions } from './Validation';
export { ValidationRule } from './ValidationRule';
export { FormElement } from './FormElement';
export { FormField, FormFieldValue, FormFieldType } from './FormField';
export { FormGroup, FormGroupType } from './FormGroup';
export { FormGroups, FormGroupsType } from './FormGroups';
export { Form, FormType } from './Form';
