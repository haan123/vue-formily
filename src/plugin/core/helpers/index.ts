import { FormFieldType, FormGroup, FormilyField, FormilyFieldSchema, RuleSchema, ValidationRuleSchema } from '../types';

import { each, isCallable, isNullOrUndefined, merge } from '../utils';
import { FORM_FIELD_TYPES, FORM_GROUPS_TYPE, FORM_GROUP_TYPE, FORM_TYPE } from '../constants';

export function traverseFields(path: string | string[] = [], fields: any) {
  if (typeof path === 'string') path = path.split('.');

  const fieldName = path.shift();
  let field = fields.find((f: any) => f.formId === fieldName) || null;

  if (!field || !path.length) {
    return field;
  }

  if (field.type === FORM_GROUP_TYPE) {
    field = traverseFields(path, field.fields);
  }

  return field;
}

export function cascadeRules(
  parentRules: Record<string, ValidationRuleSchema>,
  fields: FormilyFieldSchema[]
): FormilyFieldSchema[] {
  if (isNullOrUndefined(parentRules)) {
    return fields;
  }

  return fields.map((fieldSchema: FormilyFieldSchema) => {
    const { rules } = fieldSchema;

    if (rules) {
      each(rules, (rule: RuleSchema, key) => {
        const parentRule = parentRules[key];

        if (isCallable(parentRule) || !parentRule.cascade) {
          return;
        }

        rules[key] = merge({}, parentRules[key], rule);
      });
    }

    return fieldSchema;
  });
}

export function parents(field: FormilyField, fn: (parent: FormilyField) => void): FormilyField | null {
  let parent = field.parent;
  let root = null;

  while (parent && parent.type !== FORM_TYPE) {
    root = parent;
    parent = root.parent;

    fn(root);
  }

  return root;
}

function isFormGroupsItem(field: FormilyField): field is FormGroup {
  return field.type === FORM_GROUP_TYPE && field.index !== undefined;
}

export function isFormFieldType(type: string): type is FormFieldType {
  return !!FORM_FIELD_TYPES[type];
}

/**
 * Generate form input name
 * - Default: name
 * - Array: nameA[0][nameB]
 * - Object: nameA[nameB]
 */
export function genHtmlName(field: FormilyField): string {
  const path: string[] = [field.formId];

  if (isFormGroupsItem(field)) {
    path.push('' + field.index);
  } else if (field.type === FORM_GROUPS_TYPE && (!field.parent || field.parent.type === FORM_TYPE)) {
    return `${field.formId}[]`;
  }

  const root = parents(field, parent => {
    if (isFormGroupsItem(parent)) {
      path.unshift(parent.formId, '' + parent.index);
    } else if (isFormFieldType(parent.type) && path[0] !== parent.formId) {
      path.unshift(parent.formId);
    }
  });

  if (root && root.formId === path[0]) {
    path.shift();
  }

  return root && root.type === FORM_GROUP_TYPE ? `${root.formId}[${path.join('][')}]` : field.formId;
}
