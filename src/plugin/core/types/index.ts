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

export type Validator = (value: any) => boolean | Promise<boolean>;
export interface ValidationSchema {
  validate?: Validator;
  data?: Record<string, any>;
  message?: ValidationMessageTemplate;
}

export type ValidationRule = Validator | ValidationSchema;
export interface ValidationMessageGenerator {
  (field: string, params?: Record<string, any>): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export type FormFieldSchema = FormElementSchema & {
  readonly inputType?: string;
  readonly label?: string;
  readonly default?: FormFieldValue;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly min?: number;
  readonly max?: number;
  readonly pattern?: number;
  readonly hint?: string;
  readonly help?: string;
  readonly placeholder?: string;
  readonly options?: any[];
  readonly formatter?: () => FormFieldValue;
  readonly required?: boolean;
  readonly id?: string;
  readonly type: FormFieldType;
  value?: FormFieldValue | FormFieldValue[];
  validations?: Record<string, ValidationRule>;
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
