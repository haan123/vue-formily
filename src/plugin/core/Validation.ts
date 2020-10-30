import { ValidationResult, ValidationRuleSchema } from './types';
import { each } from './utils';
import ValidationRule from './ValidationRule';

export default class Validation {
  rules: Record<string, ValidationRule>;
  errors!: string[] | null;

  constructor(rules: Record<string, ValidationRuleSchema>, data?: any) {
    this.rules = {};

    each(rules, (schema: ValidationRuleSchema, key: string) => {
      this.addRule(key, schema, data);
    });

    this.errors = null;
  }

  addRule(key: string, ruleOrSchema: ValidationRule | ValidationRuleSchema, data?: any) {
    this.rules[key] = new ValidationRule(ruleOrSchema, data);
  }

  async validate(value: any): Promise<ValidationResult> {
    let errors: string[] | null = null;
    let isValid = true;

    await Promise.all(
      Object.keys(this.rules).map(async key => {
        const rule: ValidationRule = this.rules[key];
        const { valid, message } = await rule.validate(value);

        if (!valid) {
          isValid = false;

          if (message) {
            errors = errors ? [...errors] : [message];
          }
        }
      })
    );

    this.errors = errors;

    return {
      valid: isValid,
      errors
    };
  }
}
