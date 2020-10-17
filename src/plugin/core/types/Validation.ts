import { ValidationMessageTemplate, ValidationRule } from '.';
import { FormField } from './FormField';

export declare class Validation {
  message?: ValidationMessageTemplate;
  valid: boolean;

  constructor(rule: ValidationRule);

  validate(field: FormField): boolean;
}
