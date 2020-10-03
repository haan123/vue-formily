import { FormElement, FormFieldSchema, FormGroupSchema, FormilyField, FormilyFieldSchema } from './types';
import FormField from './FormField';
import FormGroups from './FormGroups';
import FormGroup from './FormGroup';
import Form from './Form';

export function traverseFields(path: string | string[] = [], fields: any) {
  if (typeof path === 'string') path = path.split('.');

  const fieldName = path.shift();
  let field = fields.find((f: any) => f.formId === fieldName) || null;

  if (!field || !path.length) {
    return field;
  }

  if (field instanceof FormGroup) {
    field = traverseFields(path, field.fields);
  }

  return field;
}

export function toFields(fields: FormilyFieldSchema[], parent?: FormilyField): FormilyField[] {
  return fields.map(schema => {
    switch (schema.type) {
      case 'groups':
        return new FormGroups(schema as FormGroupSchema, parent);
      case 'group':
        return new FormGroup(schema as FormGroupSchema, parent);
      default:
        return new FormField(schema as FormFieldSchema, parent);
    }
  });
}

function getNamePath(field: FormilyField, index?: number) {
  let parent = field.parent;
  const path = typeof index !== 'undefined' ? [index, field.formId] : [field.formId];

  while (parent) {
    path.unshift(parent.formId);
    parent = parent.parent;
  }

  return path;
}

function isGroupItem(field: FormilyField): field is FormGroup {
  return field instanceof FormGroup && typeof field.index !== 'undefined';
}

function isGroup(field: FormilyField): field is FormGroup | FormGroups {
  return field instanceof FormGroup || field instanceof FormGroups;
}

/**
 * Generate form input name
 * - Default: name
 * - Array: nameA[0][nameB]
 * - Object: nameA[nameB]
 */
export function genHtmlName<T extends FormElement>(field: T): string {
  let parent = field.parent;
  const path: string[] = [field.formId];
  let root = null;

  if (isGroupItem(field)) {
    path.push('' + field.index);
  } else if (field instanceof FormGroups && (!parent || parent instanceof Form)) {
    return `${field.formId}[]`;
  }

  while (parent && !(parent instanceof Form)) {
    root = parent;
    parent = root.parent;

    if (isGroupItem(root)) {
      path.unshift(root.formId, '' + root.index);
    } else if (root instanceof FormField && path[0] !== root.formId) {
      path.unshift(root.formId);
    }
  }

  if (root && root.formId === path[0]) {
    path.shift();
  }

  return root && isGroup(root) ? `${root.formId}[${path.join('][')}]` : field.formId;
}
