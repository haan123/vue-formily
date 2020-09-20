import Formily from './Formily';
import { FieldSchema, FieldType, FieldValue, FormilyField } from './types';
import { def, readOnlyDef } from './utils';

function getNamePath(field: FormilyField, index?: number) {
  let parent = field.parent;
  const path = typeof index !== 'undefined' ? [index, field.name] : [field.name];

  while (parent) {
    path.unshift(parent.name);
    parent = parent.parent;
  }

  return path;
}

export function genId(field: FormilyField, index?: number) {
  const path = getNamePath(field, index);

  return `${field.formId}-${path.join('-')}`;
}
/**
 * Generate form input name
 * - Default: name
 * - Array: nameA[0][nameB]
 * - Object: nameA[nameB]
 */
export function genInputName(field: FormilyField, index?: number) {
  const path = getNamePath(field, index);
  const root = path.shift();
  const parent = field.parent;

  if (field.collection || (parent && (parent.collection || (parent.nested && path.length)))) {
    return `${root}[${path.join('][')}]`;
  }

  return root;
}

const FIELDS = [
  'inputType',
  'value',
  'label',
  'hint',
  'placeholder',
  'options',
  'formatter',
  'collection',
  'nested',
  'name'
];

export default class Field {
  readonly formId: string;
  readonly type: FieldType = 'string';
  readonly name: string = '';
  readonly parent?: FormilyField;
  readonly inputType?: string;
  readonly value: FieldValue | FieldValue[] = '';
  readonly label?: string;
  readonly hint?: string;
  readonly placeholder?: string;
  readonly options?: any[];
  readonly formatter?: () => FieldValue;
  readonly collection: boolean = false;
  readonly nested: boolean = false;
  readonly required: boolean = false;

  constructor(fieldSchema: FieldSchema, form: Formily, parent?: FormilyField) {
    if (!fieldSchema.name) {
      throw new Error('[vue-formily] field name is not defined');
    }
    // this.model = fieldSchema.model
    this.parent = parent;
    this.formId = `f${form._uid}`;
    this.required = !!(fieldSchema.validations && fieldSchema.validations.required);

    FIELDS.forEach(propName => {
      const value = fieldSchema[propName];

      if (typeof value !== 'undefined') {
        readOnlyDef(this, propName, value);
      }
    });

    /**
     * if this is belonging in a collection field
     * then the properties below will be set in the item of collection field
     */
    if (parent && !parent.collection) {
      readOnlyDef(this, 'inputName', genInputName(this));
      readOnlyDef(this, 'id', fieldSchema.id || genId(this));
    }
  }
}
