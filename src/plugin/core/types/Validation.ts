import { ValidationRule, ValidationRuleSchema } from '.';

export interface ValidationOptions {
  bails?: boolean;
}

export type ValidationResult = {
  valid: boolean;
  errors: string[] | null;
  invalidRules: Record<string, ValidationRule> | null;
};

export type ValidationProps = Record<string, any>;

export declare class Validation {
  constructor(rules: Record<string, ValidationRuleSchema>, data?: any);

  rules: Record<string, ValidationRule>;
  errors: string[] | null;
  valid: boolean;

  validate(value: any): Promise<ValidationResult>;
  addRule(key: string, ruleOrSchema: ValidationRule | ValidationRuleSchema, data?: any): void;
}
