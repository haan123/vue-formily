import { genProps } from '.';
import { FormField, SchemaValidation, ValidationRuleSchema } from '../../types';
import { each, isCallable, isNullOrUndefined, isNumber, isPlainObject } from '../utils';

export function cast(value: any, type: FormField['type']): FormField['value'] {
  let typedValue: FormField['value'] = null;

  if (value === undefined) {
    return typedValue;
  }

  if (type === 'string') {
    typedValue = value ? '' + value : '';
  } else if (type === 'number') {
    if (!isNumber(value)) {
      throw new Error(`"${value}" is not a "number"`);
    }

    typedValue = +value;
  } else if (type === 'boolean') {
    typedValue = !!value;
  } else if (type === 'date') {
    try {
      typedValue = new Date(value);
    } catch (error) {
      throw new Error(`"${value}" is not a "date" value`);
    }
  }

  return typedValue;
}

export function getLength(value: any): number {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (isPlainObject(value)) {
    return Object.keys(value).length;
  }

  if (typeof value === 'string') {
    return value.length;
  }

  return 0;
}

const _cache = {
  value: null,
  isEmpty: false
};

export function isEmptyValue(value: any): boolean {
  let isEmpty = false;

  if (_cache.value === value) {
    return _cache.isEmpty;
  }

  if (isNullOrUndefined(value)) {
    isEmpty = false;
  } else if (value === false || !getLength(value)) {
    isEmpty = true;
  }

  _cache.value = value;
  _cache.isEmpty = isEmpty;

  return isEmpty;
}

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
  const i = {
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
