import { genInputName, genId } from './FormElement';
import CollectionField, { traverseFields } from './FormGroup';
import { readOnlyDef } from './utils';

export default class FormGroupItem {
  index!: number;
  fields!: FormGroupItem[];

  constructor(field: CollectionField) {
    readOnlyDef(this, 'index', field.items.length);

    readOnlyDef(
      this,
      'fields',
      field.fields.map(field => {
        const f = Object.create(field);

        readOnlyDef(f, 'inputName', genInputName(field, this.index));
        readOnlyDef(f, 'id', genId(field, this.index));

        return f;
      })
    );
  }

  getField(path = [], fields?: FormGroupItem[]) {
    return traverseFields(path, fields || this.fields);
  }
}
