import { ValidationRuleSchema, SchemaValidation } from '../types';
import { isCallable } from '../utils';

export function normalizeRules(rules: ValidationRuleSchema[] = [], type: string | null = null): ValidationRuleSchema[] {
  const _rules: ValidationRuleSchema[] = [];

  rules.forEach((rule: ValidationRuleSchema) => {
    /**
     * Only apply validation rule to 'function' or 'undefined' or field that has type is included in 'types' property of the rule
     */
    if (isCallable(rule) || !rule.for || (type && rule.for.includes(type))) {
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
