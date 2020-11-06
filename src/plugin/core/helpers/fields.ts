import { ValidationRuleSchema, FormilyFieldSchema, RuleSchema, PropValue } from '../types';
import { isNullOrUndefined, each, isCallable, merge, getter } from '../utils';

export function toProps(obj: any, props?: Record<string, PropValue>): Record<string, PropValue> | null {
  const _props = props ? {} : null;

  each(props, (propValue, propName) => {
    getter(_props, propName, (value: any) => {
      if (value !== undefined) {
        return value;
      }

      return isCallable(propValue) ? propValue.call(obj, obj.value) : propValue;
    });
  });

  return _props;
}

export function traverseFields(path: string | string[] = [], fields: any) {
  if (typeof path === 'string') path = path.split('.');

  const fieldName = path.shift();
  let field = fields.find((f: any) => f.formId === fieldName) || null;

  if (!field || !path.length) {
    return field;
  }

  if ('fields' in field) {
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

        if (!parentRule || isCallable(parentRule) || !parentRule.cascade || !rule.inherit) {
          return;
        }

        rules[key] = merge({}, parentRules[key], rule);
      });
    }

    return fieldSchema;
  });
}
