import { FormElement } from './FormElement';
import { FormField, FormFieldValue, FormFieldType } from './FormField';
import { FormGroups, FormGroupsType } from './FormGroups';
import { FormGroup, FormGroupType } from './FormGroup';
import { Form } from './Form';
import { Forms } from './Forms';
import { Validation } from './Validation';
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
};

export type Validations = {
  [name: string]: Validation;
};

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export type Validator = (value: any, ...args: any[]) => boolean | Promise<boolean>;
export type RuleParamSchema = {
  name: string;
  default?: FormFieldValue;
};
export interface RuleSchema {
  validate?: Validator;
  types?: FormFieldType[];
  params?: RuleParamSchema[];
  message?: ValidationMessageTemplate;
  cascade?: boolean;
  inherit?: boolean;
}

export type ValidationRuleSchema = Validator | RuleSchema;
export interface ValidationMessageGenerator {
  (value: any, params?: Map<string, any>, data?: Map<string, any>): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export type PropValue = FormFieldValue | ((this: FormField, value: any) => FormFieldValue);

export type FormFieldSchema = FormElementSchema & {
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
  rules?: Record<string, ValidationRuleSchema>;
};

export type FormGroupSchema = FormElementSchema & {
  readonly type: FormGroupType;
  fields: FormilyFieldSchema[];
};

export type FormGroupsSchema = FormElementSchema & {
  readonly type: FormGroupsType;
  fields: FormilyFieldSchema[];
};

export type FormSchema = FormElementSchema & {
  fields: FormilyFieldSchema[];
};

export type FormilyFieldType = FormFieldType | FormGroupsType;

export type FormilyFieldSchema = FormFieldSchema | FormGroupSchema | FormGroupsSchema;

export type FormilyField = FormElement | FormField | FormGroups | FormGroup;

export interface FormilyOptions {
  name?: string;
}

export { Validation } from './Validation';
export { ValidationRule } from './ValidationRule';
export { FormElement } from './FormElement';
export { FormField, FormFieldValue, FormFieldType } from './FormField';
export { FormGroup } from './FormGroup';
export { FormGroups, FormGroupsType } from './FormGroups';
export { Form } from './Form';
