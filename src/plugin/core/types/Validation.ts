import { ValidationRule, ValidationRuleSchema } from '.';

export declare class Validation {
  constructor(rule: ValidationRule);

  rules: Record<string, ValidationRule>;
  errors: string[];

  validate(value: any): Promise<{ valid: boolean; message: string }>;
  addRule(key: string, ruleOrSchema: ValidationRule | ValidationRuleSchema): void;
}
