import { ValidationMessageTemplate, ValidationProps, ValidationRuleSchema, Validator } from '.';
import { ValidationRuleResult } from '../ValidationRule';

export declare class ValidationRule {
  constructor(rule: ValidationRule | ValidationRuleSchema, data?: any);

  readonly data: Map<string, any>;
  readonly props: ValidationProps;
  readonly _template: ValidationMessageTemplate | null;
  readonly _validator: Validator;
  message: string | null;
  valid: boolean;

  addData(key: string, value: any): void;
  validate(value: any): Promise<ValidationRuleResult>;
}
