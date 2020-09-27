import { FieldSchema, FieldValue, VFField, FormFieldType } from './types';
import Form from './Form';
import FormElement, { genId, genInputName } from './FormElement';
import { readOnlyDef } from './utils';

const FIELDS = ['inputType', 'label', 'hint', 'placeholder', 'options', 'formatter'];

export default class FormField extends FormElement {
  readonly inputType?: string;
  readonly label?: string;
  readonly hint?: string;
  readonly placeholder?: string;
  readonly options?: any[];
  readonly formatter?: () => FieldValue;
  readonly required!: boolean;
  /**
   * The global unique name of the field, which can be used as name in the html form. For radio buttons this name is not unique.
   */
  readonly inputName!: string;
  readonly type!: FormFieldType;
  value: FieldValue | FieldValue[];

  constructor(fieldSchema: FieldSchema, form: Form, parent?: VFField) {
    super(fieldSchema, parent);

    readOnlyDef(this, 'inputName', genInputName(this));
    readOnlyDef(this, 'id', fieldSchema.id || genId(this));
    readOnlyDef(this, 'required', !!(fieldSchema.validations && fieldSchema.validations.required));

    FIELDS.forEach(propName => {
      const value = fieldSchema[propName];

      if (typeof value !== 'undefined') {
        readOnlyDef(this, propName, value);
      }
    });

    this.value = fieldSchema.value || null;
  }
}
