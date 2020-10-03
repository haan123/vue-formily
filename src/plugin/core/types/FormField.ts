import { FormFieldSchema, FormilyField } from '.';
import { FormElement } from './FormElement';

export type FormFieldValue = string | number | boolean | Date | null;
export type FormFieldType = 'string' | 'number' | 'boolean' | 'date';

export declare class FormField extends FormElement {
  constructor(schema: FormFieldSchema, parent?: FormilyField);

  readonly inputType?: string;
  readonly label?: string;
  readonly hint?: string;
  readonly help?: string;
  readonly placeholder?: string;
  readonly options?: any[];
  readonly formatter?: () => FormFieldValue;
  readonly required?: boolean;
  readonly type: FormFieldType;
  value: FormFieldValue | FormFieldValue[];

  setValue(value: any): any;
}
