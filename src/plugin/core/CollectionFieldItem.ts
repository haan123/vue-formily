import { FormilyField } from '../types';
import { genInputName, genId } from './Field';
import CollectionField, { traverseFields } from './CollectionField';
import { readOnlyDef } from '../utils';

export default class CollectionFieldItem {
  readonly index!: number;
  readonly fields!: FormilyField[];

  constructor(field: CollectionField) {
    readOnlyDef(this, 'index', field.items.length);

    readOnlyDef(
      this,
      'fields',
      field.fields.map(field => {
        const f = Object.create(field);

        readOnlyDef(f, 'item', this);
        readOnlyDef(f, 'inputName', genInputName(field, this.index));
        readOnlyDef(f, 'id', genId(field, this.index));

        return f;
      })
    );
  }

  getField(path: string | string[], fields?: FormilyField[]) {
    return traverseFields(path, fields || this.fields);
  }
}
