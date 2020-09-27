import Form from './Form';
import { VFFieldSchema, FieldValue, VFField } from './types';
import { readOnlyDef } from './utils';

function getNamePath(field: VFField, index?: number) {
  let parent = field.parent;
  const path = typeof index !== 'undefined' ? [index, field.name] : [field.name];

  while (parent) {
    path.unshift(parent.name);
    parent = parent.parent;
  }

  return path;
}

export function genId(field: VFField, index?: number) {
  const path = getNamePath(field, index);

  return `${field.formId}-${path.join('-')}`;
}
/**
 * Generate form input name
 * - Default: name
 * - Array: nameA[0][nameB]
 * - Object: nameA[nameB]
 */
export function genInputName(field: VFField, index?: number) {
  const path = getNamePath(field, index);
  const root = path.shift();
  const parent = field.parent;

  if (field.collection || (parent && (parent.collection || (parent.nested && path.length)))) {
    return `${root}[${path.join('][')}]`;
  }

  return root;
}

export default class FormElement {
  readonly name: string = '';

  /**
   * The parent within the form.
   */
  readonly parent!: FormElement;

  constructor(name: string, parent?: FormElement) {
    if (!name) {
      throw new Error('[vue-formily] form element name is not defined');
    }

    // this.model = fieldSchema.model
    readOnlyDef(this, 'name', name);
    readOnlyDef(this, 'parent', parent || null);
  }

  /**
   * This method clears the whole form. After clearing a form it contains no value or the default value, is not bound to any business object and has the status of being valid.
   */
  clearFormElement() {}

  /**
   * The method can be called to explicitly invalidate a form element. The error text will be set to the one of two possible preconfigured custom error messages associated with the form definition. The "value-error" message will be used for FormField instances and "form-error" will be used for FormGroup instances.
   */
  invalidateFormElement() {}
}
