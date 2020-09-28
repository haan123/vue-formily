import Form from './Form';
import { FieldSchema, FieldValue, FormilyField, GenericFieldType } from '../types';
import { readOnlyDef } from '../utils';
import CollectionField from './CollectionField';

function getNamePath(field: FormilyField, index?: string | number): string[] {
  let parent = field.parent;
  const path = typeof index !== 'undefined' ? [`${index}`, field.name] : [field.name];

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
// export function genInputName(field: FormilyField, index?: number): string {
//   const path = getNamePath(field, index);
//   const root = path.shift();
//   const parent = field.parent;

//   if (field instanceof CollectionField || parent instanceof CollectionField) {
//     return `${root}[${path.join('][')}]`;
//   }

//   return root || '';
// }

export function genInputName(field: FormilyField, name = ''): string {
  const parent = field.parent
  name = name || ''

  if (field instanceof CollectionField) {
    name = `[${field.item.index}]${name}`
  } else {
    name = field.name
  }

  if (parent) {
    name = genInputName(parent, name)
  }

  return name
}

const FIELDS = [
  'inputType',
  'label',
  'hint',
  'placeholder',
  'options',
  'formatter',
  'name'
];

export default class Field {
  readonly formId!: string;
  readonly name!: string;
  readonly parent!: FormilyField | null;
  readonly inputType?: string;
  readonly label?: string;
  readonly hint?: string;
  readonly placeholder?: string;
  readonly options?: any[];
  readonly formatter?: () => FieldValue;
  readonly required!: boolean;

  constructor(fieldSchema: FieldSchema, form: Form, parent: (FormilyField | null) = null) {
    if (!fieldSchema.name) {
      throw new Error('[vue-formily] field name is not defined');
    }
    // this.model = fieldSchema.model
    readOnlyDef(this, 'parent', parent);
    readOnlyDef(this, 'formId', `f${form._uid}`);
    readOnlyDef(this, 'required', !!(fieldSchema.validations && fieldSchema.validations.required));

    FIELDS.forEach(propName => {
      const value = fieldSchema[propName];

      if (typeof value !== 'undefined') {
        readOnlyDef(this, propName, value);
      }
    });
  }
}
