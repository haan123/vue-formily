import { RuleSchema, ValidationResult, Validator } from './types';
import { def, each, isEmpty } from '../../utils';
import Rule from './Rule';

type ValitionRuleSchema = Validator | RuleSchema;

export type ExtValidation<K extends string> = Validation & {
  [key in K]: Rule;
}

export default class Validation {
  rules: Rule[] = [];
  errors: string[] | null = null;

  constructor(rules: ValitionRuleSchema[], data?: any) {
    rules.forEach((schema: ValitionRuleSchema) => {
      this.addRule(schema, data);
    });

    this.rules.forEach((rule) => def(this, rule.name, rule, { writable: false }));
  }

  addRule(ruleOrSchema: Rule | ValitionRuleSchema, data?: any) {
    const rule = new Rule(ruleOrSchema, data);

    if (!this.rules) {
      this.rules = [rule]
    } else {
      const found = this.rules.find((rule) => rule.name);

      if (!found) {
        this.rules = this.rules ? [...this.rules, rule] : [rule];
      }
    }
  }

  reset() {
    this.errors = null;

    each(this.rules, (rule) => rule.reset());
  }

  async validate(value: any): Promise<ValidationResult> {
    const errors: string[] = [];

    if (this.rules) {
      await Promise.all(
        this.rules.map(async rule => {
          const { error } = await rule.validate(value);

          if (error) {
            errors.push(error);
          }
        })
      );
    }

    this.errors = !isEmpty(errors) ? errors : null;

    return {
      errors: this.errors
    };
  }
}
