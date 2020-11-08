import { FormilyFieldSchema, RuleSchema, ValidationRuleSchema } from '../types';

import { each, isCallable, isNullOrUndefined, merge } from '../utils';

export function traverseFields(path: string | string[] = [], fields: any) {
  if (typeof path === 'string') path = path.split('.');

  const fieldName = path.shift();
  let field = fields.find((f: any) => f.formId === fieldName) || null;

  if (!field || !path.length) {
    return field;
  }

  if ('fields' in field.type) {
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

        if (isCallable(parentRule) || !parentRule.cascade || !rule.inherit) {
          return;
        }

        rules[key] = merge({}, parentRules[key], rule);
      });
    }

    return fieldSchema;
  });
}
