import { Validator, RuleSchema, ValidationResult } from './types';
import { each, isEmpty } from '../../utils';
import ValidationRule from './ValidationRule';

type VSchema = Validator | RuleSchema;

export default class Validation {
  rules: Record<string, ValidationRule> | null = null;
  errors: string[] | null = null;
  valid = true;

  constructor(rules: Record<string, VSchema>, data?: any) {
    each(rules, (schema: VSchema, key: string) => {
      this.addRule(key, schema, data);
    });
  }

  addRule(key: string, ruleOrSchema: ValidationRule | VSchema, data?: any) {
    if (!this.rules) {
      this.rules = {};
    }

    this.rules[key] = new ValidationRule(ruleOrSchema, data);
  }

  reset() {
    this.errors = null;
    this.valid = true;

    each(this.rules, (rule) => rule.reset());
  }

  async validate(value: any): Promise<ValidationResult> {
    const rules = this.rules;
    const errors: string[] = [];
    let isValid = true;

    if (rules) {
      await Promise.all(
        Object.keys(rules).map(async key => {
          const rule: ValidationRule = rules[key];
          const { error } = await rule.validate(value);

          if (error) {
            isValid = false;
            errors.push(error);
          }
        })
      );
    }

    this.errors = !isEmpty(errors) ? errors : null;
    this.valid = isValid;

    return {
      errors: this.errors
    };
  }
}
