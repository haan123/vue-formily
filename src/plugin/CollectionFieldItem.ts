import { genInputName, genId } from './Field';
import { traverseFields } from './CollectionField';

import { readOnlyDef } from './utils';

export default class CollectionFieldItem {
  constructor(collectionField) {
    readOnlyDef(this, 'index', collectionField.items.length);

    readOnlyDef(
      this,
      'fields',
      collectionField.fields.map(field => {
        const f = Object.create(field);

        readOnlyDef(f, 'inputName', genInputName(field, this.index));
        readOnlyDef(f, 'id', genId(field, this.index));

        return f;
      })
    );
  }

  getField(path = [], fields) {
    return traverseFields(path, fields || this.fields);
  }
}
