import FormElement from './FormElement';
import { toFields, traverseFields } from './helpers';
import { FormGroupSchema, FormilyField } from './types';
import { vfMessage } from './utils';

export default class FormGroup extends FormElement {
  fields: FormilyField[];

  constructor(schema: FormGroupSchema, parent?: FormilyField, index?: number) {
    super(schema.formId, parent, index);

    if (!schema.fields || !schema.fields.length) {
      throw new Error(vfMessage('Missing "fields", please provide a "fields" property for your schema'));
    }

    // this should not read only because we want nested fields reactivable
    this.fields = toFields(schema.fields, this);
  }

  getField(path: string | string[] = [], fields?: FormilyField[]): FormilyField | null {
    return traverseFields(path, fields || this.fields);
  }
}
