import { ValidationRuleSchema, SchemaValidation } from '../types';

import { genProps } from './elements';
import { each, isCallable, isNumber } from '../utils';

export function genValidationRules(
  rules?: Record<string, ValidationRuleSchema>,
  props: Record<string, any> | null = null,
  type: string | null = null,
  ...args: any[]
): Record<string, ValidationRuleSchema> {
  const validationRules: Record<string, ValidationRuleSchema> = {};

  each(rules, (rule: ValidationRuleSchema, key: string) => {
    /**
     * Only apply validation rule to 'function' or 'undefined' or field that has type is included in 'types' property of the rule
     */
    if (isCallable(rule)) {
      validationRules[key] = rule;
    } else if (!rule.types || (type && rule.types.includes(type))) {
      const _rule: ValidationRuleSchema | null = rule;

      if (props && key in props) {
        const _props = genProps([rule.props, [key, props]], ...args);

        if (_props) {
          _rule.props = _props;
        }
      }

      validationRules[key] = _rule;
    }
  });

  return validationRules;
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
