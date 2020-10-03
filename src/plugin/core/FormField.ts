import { FormFieldSchema, FormilyField } from './types';
import FormElement from './FormElement';
import { def, vfMessage } from './utils';
import { FormFieldValue, FormFieldType } from './types/FormField';

const FIELDS = ['inputType', 'label', 'hint', 'placeholder', 'options', 'formatter'];

export default class FormField extends FormElement {
  readonly inputType?: string;
  readonly label?: string;
  readonly hint?: string;
  readonly help?: string;
  readonly placeholder?: string;
  readonly options?: any[];
  readonly formatter?: () => FormFieldValue;
  readonly required?: boolean;
  readonly type!: FormFieldType;
  value!: FormFieldValue | FormFieldValue[];

  constructor(schema: FormFieldSchema, parent?: FormilyField) {
    super(schema.formId, parent);

    def(this, 'required', !!(schema.validations && schema.validations.required), false);

    FIELDS.forEach(propName => {
      const value = schema[propName];

      if (typeof value !== 'undefined') {
        def(this, propName, value, false);
      }
    });

    def(this, 'value', this.setValue);
  }

  setValue(value: any) {
    const valueType = typeof value;

    if (this.type !== valueType) {
      throw new Error(vfMessage(`Value has to be a "${this.type}" but got "${valueType}"`));
    }

    return value;
  }
}
