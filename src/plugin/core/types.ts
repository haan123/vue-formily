import Form from './Form';
import FormGroup from './FormGroup';
import FormField from './FormField';

declare module 'vue/types/vue' {
  interface Vue {
    $formily: {
      add: (formSchema: VFFieldSchema[], options?: FormilyOptions) => Form;
    };
  }
}

type _FieldBase = {
  name: string;
  type: VFFieldType;
  id?: string;
  value?: FieldValue;
  label?: string;
  hint?: string;
  options?: any[];
  inputType?: string;
  placeholder?: string;
  collection?: boolean;
  nested?: boolean;
  formatter?: () => FieldValue;
  [key: string]: any;
};

export type FieldValue = string | number | Date | boolean | null;

export type VFFieldType = FormFieldType | FormGroupType;

export type FormFieldType = 'string' | 'number' | 'boolean' | 'date';

export type FormGroupType = 'collection';

export type VFFieldSchema = FieldSchema | FormGroupSchema;

export type FieldSchema = _FieldBase & {
  validations?: any;
};

export type FormGroupSchema = FieldSchema & {
  fields: VFFieldSchema[];
};

export type VFField = FormField | FormGroup;

export interface FormilyOptions {
  name?: string;
}
