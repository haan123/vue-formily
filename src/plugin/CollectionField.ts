import CollectionFieldItem from './CollectionFieldItem';
import Field from './Field';
import Formily from './Formily';
import { CollectionFieldSchema, FieldSchema, FieldValue, FormilyField, FormilyFieldSchema } from './types';

// import { readOnlyDef } from './utils'

export function traverseFields(path: string | string[] = [], fields: FormilyField[]): FormilyField | undefined {
  if (typeof path === 'string') path = path.split('.');

  const fieldName = path.shift();
  let field = fields.find(f => f.name === fieldName);

  if (!field || !path.length) {
    return field;
  }

  if (field.fields) {
    field = traverseFields(path, field.fields);
  }

  return field;
}

export function toFields(fields: FormilyFieldSchema[], form: Formily, parent?: FormilyField): FormilyField[] {
  return fields.map(fieldSchema => {
    let field: FormilyField;

    if (fieldSchema.collection || fieldSchema.nested) {
      /**
       * Result like this:
       * {
       *  type: 'collection | nested';
       *  model: <name>;
       *  fields: Array<field>;
       *  ...
       * }
       */
      field = new CollectionField(fieldSchema, form, parent);
    } else {
      field = new Field(fieldSchema, form, parent);
    }

    return field;
  });
}

export default class CollectionField extends Field {
  fields: FormilyField[];
  items: CollectionFieldItem[];
  readonly value: FieldValue[] = [];

  constructor(fieldSchema: FormilyFieldSchema, form: Formily, parent?: FormilyField) {
    super(fieldSchema, form, parent);

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

  // addItems(items: CollectionFieldItem[]) {
  //   this.items = items.map(this.addItem)
  // }

  addItem() {
    const item = new CollectionFieldItem(this);

    this.items.push(item);
  }

  getField(path = [], fields: FormilyField[]) {
    return traverseFields(path, fields || this.fields);
  }
}
