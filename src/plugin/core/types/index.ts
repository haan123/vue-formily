import { FormElement } from './FormElement';
import { FormField, FormFieldValue, FormFieldType } from './FormField';
import { FormGroups, FormGroupsType } from './FormGroups';
import { FormGroup } from './FormGroup';
import { Form } from './Form';
import { Forms } from './Forms';

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
  [key: string]: any;
};

export type FormFieldSchema = FormElementSchema & {
  readonly inputType?: string;
  readonly label?: string;
  readonly hint?: string;
  readonly help?: string;
  readonly placeholder?: string;
  readonly options?: any[];
  readonly formatter?: () => FormFieldValue;
  readonly required?: boolean;
  readonly id?: string;
  readonly type: FormFieldType;
  value?: FormFieldValue | FormFieldValue[];
  validations?: any;
  [key: string]: any;
};

export type FormGroupSchema = FormElementSchema & {
  fields: FormilyFieldSchema[];
};

export type FormGroupsSchema = FormElementSchema & {
  readonly type: FormGroupsType;
  fields: FormilyFieldSchema[];
};

export type FormSchema = FormGroupSchema & {
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
