import { FormElement } from './FormElement';
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
};

export type Validations = {
  [name: string]: Validation;
};

export type Validator = (this: Validation, value: any, ...args: any[]) => boolean | Promise<boolean>;
export type ValidationParamSchema = {
  name: string,
  default?: FormFieldValue;
};
export interface ValidationSchema {
  validate?: Validator;
  params?: ValidationParamSchema[];
  types?: FormFieldType[];
  message?: ValidationMessageTemplate;
  cascade?: boolean;
  inherit?: boolean;
}

export type ValidationRule = Validator | Record<string, ValidationSchema>;
export interface ValidationMessageGenerator {
  (field: string, params?: Record<string, any>): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export type FormFieldSchema = FormElementSchema & {
  readonly inputType?: string;
  readonly label?: string;
  readonly default?: FormFieldValue;
  readonly hint?: string;
  readonly help?: string;
  readonly placeholder?: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly options?: any[];
  readonly formatter?: () => FormFieldValue;
  readonly id?: string;
  readonly type: FormFieldType;
  value?: FormFieldValue | FormFieldValue[];
  validations?: ValidationRule;
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

export { FormElement } from './FormElement';
export { FormField, FormFieldValue, FormFieldType } from './FormField';
export { FormGroup } from './FormGroup';
export { FormGroups, FormGroupsType } from './FormGroups';
export { Form } from './Form';
