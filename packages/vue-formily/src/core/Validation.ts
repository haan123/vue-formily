import { isEmptyValue } from '../helpers';
import { ValidationResult, ValidationRuleSchema } from '../../types';
import { each } from '../utils';
import ValidationRule from './ValidationRule';

export default class Validation {
  rules: Record<string, ValidationRule> | null = null;
  errors: string[] | null = null;
  valid = true;

  constructor(rules: Record<string, ValidationRuleSchema>, data?: any) {
    each(rules, (schema: ValidationRuleSchema, key: string) => {
      this.addRule(key, schema, data);
    });
  }

  addRule(key: string, ruleOrSchema: ValidationRule | ValidationRuleSchema, data?: any) {
    if (!this.rules) {
      this.rules = {};
    }

    this.rules[key] = new ValidationRule(ruleOrSchema, data);
  }

  async validate(value: any): Promise<ValidationResult> {
    const rules = this.rules;
    const errors: string[] = [];
    const invalidRules: Record<string, ValidationRule> = {};
    let isValid = true;

    if (rules) {
      await Promise.all(
        Object.keys(rules).map(async key => {
          const rule: ValidationRule = rules[key];
          const { valid, message } = await rule.validate(value);

          if (!valid) {
            isValid = false;

            invalidRules[key] = rule;

            if (message) {
              errors.push(message);
            }
          }
        })
      );
    }

    this.errors = !isEmptyValue(errors) ? errors : null;
    this.valid = isValid;

    return {
      valid: this.valid,
      errors: this.errors,
      invalidRules: !isEmptyValue(invalidRules) ? invalidRules : null
    };
  }
}
