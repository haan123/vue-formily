import Field from './Field';
import CollectionFieldItem from './CollectionFieldItem';
import GenericField from './GenericField';
import Form from './Form';
import { FormilyField, FormilyFieldSchema, FieldValue, CollectionFieldType } from '../types';
import { readOnlyDef } from '../utils';

// import { readOnlyDef } from './utils'

export function traverseFields(path: string | string[] = [], fields: any[]) {
  if (typeof path === 'string') path = path.split('.');

  const fieldName = path.shift();
  let field = fields.find(f => f.name === fieldName) || null;

  if (!path.length) {
    return field;
  }

  if ('fields' in field) {
    field = traverseFields(path, field.fields);
  }

  return field;
}

export function toFields(fields: FormilyFieldSchema[], form: Form, parent: (FormilyField | null) = null): FormilyField[] {
  return fields.map(fieldSchema => {
    switch (fieldSchema.type) {
      case 'collection':
      case 'nested':
        /**
         * Result like this:
         * {
         *  type: 'collection | nested';
         *  model: <name>;
         *  fields: Array<field>;
         *  ...
         * }
         */
        return new CollectionField(fieldSchema, form, parent);
      default:
        return new GenericField(fieldSchema, form, parent);
    }
  });
}

export default class CollectionField extends Field {
  fields: FormilyField[];
  items: CollectionFieldItem[];
  readonly value!: FieldValue[];
  readonly type!: CollectionFieldType;
  readonly item?: CollectionFieldItem;

  constructor(fieldSchema: FormilyFieldSchema, form: Form, parent: (FormilyField | null)) {
    super(fieldSchema, form, parent);

    // this should not read only because we want nested fields reactivable
    this.fields = toFields(fieldSchema.fields, form, this);
    this.items = [];

    readOnlyDef(this, 'type', 'collection')
    readOnlyDef(this, 'value', fieldSchema.value || [])

    // if (
    //   !['number', 'string'].includes(this.type) &&
    //   this.value &&
    //   this.value.length
    // ) {
    //   this.addItems(this.value)
    // }
  }

  // addItems(items: CollectionFieldItem[]) {
  //   this.items = items.map(this.addItem)
  // }

  addItem() {
    const item = new CollectionFieldItem(this);

    this.items.push(item);
  }

  getField(path: string | string[], fields: FormilyField[]) {
    return traverseFields(path, fields || this.fields);
  }
}
