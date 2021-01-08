import { ValidationRuleSchema, SchemaValidation } from '../types';

import { genProps } from './elements';
import { isCallable } from '../utils';

export function normalizeRules(
  rules: ValidationRuleSchema[] = [],
  props: Record<string, any> | null = null,
  type: string | null = null,
  ...args: any[]
): ValidationRuleSchema[] {
  const _rules: ValidationRuleSchema[] = [];

  rules.forEach((rule: ValidationRuleSchema) => {
    /**
     * Only apply validation rule to 'function' or 'undefined' or field that has type is included in 'types' property of the rule
     */
    if (isCallable(rule)) {
      _rules.push(rule);
    } else if (!rule.for || (type && rule.for.includes(type))) {
      const _rule: ValidationRuleSchema | null = rule;

      if (props && rule.name && rule.name in props) {
        const _props = genProps([rule.props, [rule.name, props]], ...args);

        if (_props) {
          _rule.props = _props;
        }
      }

      _rules.push(rule);
    }
  });

  return _rules;
}

export function invalidateSchemaValidation(sv: SchemaValidation, reason?: string, infos?: Record<string, string>) {
  sv.valid = false;
  sv.reason = reason;
  sv.infos = infos;
}

export function indentifySchema(schema: any, type: string) {
  const i: {
    identified: boolean;
    sv: SchemaValidation;
  } = {
    identified: false,
    sv: { valid: false }
  };

  if ('__is__' in schema) {
    i.identified = true;

    if (schema.__is__ === type) {
      i.sv.valid = true;
    }
  } else {
    i.sv.valid = true;
  }

  return i;
}
