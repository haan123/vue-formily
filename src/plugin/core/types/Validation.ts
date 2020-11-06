import { ValidationRule, ValidationRuleSchema } from '.';

export interface ValidationOptions {
  bails?: boolean;
}

export type ValidationResult = {
  valid: boolean;
  errors: string[] | null;
};

export type ValidationProps = Record<string, any>;

export declare class Validation {
  constructor(rule: ValidationRule, data?: any);

  rules: Record<string, ValidationRule>;
  errors: string[];

  validate(value: any): Promise<ValidationResult>;
  addRule(key: string, ruleOrSchema: ValidationRule | ValidationRuleSchema, data?: any): void;
}
