import { ValidationMessageTemplate, ValidationRule } from '.';

export declare class Validation {
  constructor(rule: ValidationRule);

  readonly params: Map<string, any>;
  message?: ValidationMessageTemplate;
  valid: boolean;

  validate(value: any, context: any): boolean;
}
