import FormGroupItem from './FormGroupItem';
import FormElement from './FormElement';
import Form from './Form';
import FormField from './FormField';
import { FormGroupType, FieldValue, VFField, VFFieldSchema } from './types';
import { readOnlyDef } from './utils';

export function traverseFields(path: string | string[] = [], fields: any) {
  if (typeof path === 'string') path = path.split('.');

  const fieldName = path.shift();
  let field = fields.find((f: any) => f.name === fieldName);

  if (!field || !path.length) {
    return field;
  }

  if (field.fields) {
    field = traverseFields(path, field.fields);
  }

  return field;
}

export function toFields(fields: VFFieldSchema[], form: Form, parent?: VFField): VFField[] {
  return fields.map(fieldSchema => {
    let field: VFField;

    if (fieldSchema instanceof FormGroup) {
      /**
       * Result like this:
       * {
       *  type: 'collection | nested';
       *  model: <name>;
       *  fields: Array<field>;
       *  ...
       * }
       */
      field = new FormGroup(fieldSchema, form, parent);
    } else {
      field = new FormField(fieldSchema, form, parent);
    }

    return field;
  });
}

export default class FormGroup extends FormElement {
  fields: VFField[];
  items: FormGroupItem[];
  readonly type!: FormGroupType;
  readonly value!: FieldValue[];

  constructor(fieldSchema: VFFieldSchema, form: Form, parent?: VFField) {
    super(fieldSchema, form, parent);

    readOnlyDef(this, 'type', 'collection');
    readOnlyDef(this, 'value', fieldSchema.value || []);

    // this should not read only because we want nested fields reactivable
    this.fields = toFields(fieldSchema.fields, form, this);
    this.items = [];

    // if (
    //   !['number', 'string'].includes(this.type) &&
    //   this.value &&
    //   this.value.length
    // ) {
    //   this.addItems(this.value)
    // }
  }

  // addItems(items: FormGroupItem[]) {
  //   this.items = items.map(this.addItem)
  // }

  addItem() {
    const item = new FormGroupItem(this);

    this.items.push(item);
  }

  getField(path = [], fields?: VFField[]) {
    return traverseFields(path, fields || this.fields);
  }
}
