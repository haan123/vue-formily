import { ValidationRuleSchema, FormilyFieldSchema, RuleSchema, PropValue } from '../types';
import { isNullOrUndefined, each, isCallable, merge, getter, isPlainObject } from '../utils';
import { isEmptyValue } from './validations';

function genProp(obj: any, props: Record<string, PropValue>, key: string, context?: any, ...args: any[]) {
  const property = Object.getOwnPropertyDescriptor(props, key);
  const _getter = property && property.get;

  getter(
    obj,
    key,
    _getter
      ? _getter
      : (val: any) => {
          if (val !== undefined) {
            return val;
          }
          const value = props[key];

          return isCallable(value) ? value.call(context, ...args) : value;
        }
  );
}

export function genProps(
  properties?: (Record<string, PropValue> | any[] | undefined)[],
  context?: any,
  ...args: any[]
): Record<string, PropValue> | null {
  if (!properties || !properties.length) {
    return null;
  }

  const _props: Record<string, PropValue> = {};

  properties.forEach(props => {
    if (Array.isArray(props)) {
      if (props.length === 2 && typeof props[0] === 'string') {
        genProp(_props, props[1], props[0], context, ...args);
      } else {
        props.forEach(p => {
          if (!Array.isArray(p)) {
            genProps(p, context, ...args);
          }
        });
      }
    } else if (isPlainObject(props)) {
      const keys = Object.keys(props);

      keys.forEach(key => {
        genProp(_props, props, key, context, ...args);
      });
    }
  });

  return !isEmptyValue(_props) ? _props : null;
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
    const { rules = {} } = fieldSchema;

    each(parentRules, (parentRule: RuleSchema, key) => {
      const rule = rules[key];

      if (isCallable(parentRule) || !parentRule.cascade || (rule && 'inherit' in rule && rule.inherit === false)) {
        return;
      }

      rules[key] = merge({}, parentRule, rule);
    });

    fieldSchema.rules = rules;

    return fieldSchema;
  });
}
