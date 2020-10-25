import { ValidationMessageTemplate, ValidationRuleSchema, Validator } from '.';

export declare class ValidationRule {
  constructor(rule: ValidationRuleSchema);

  readonly data: Map<string, unknown>;
  readonly params: Map<string, unknown> | null;
  readonly _template: ValidationMessageTemplate | null;
  readonly _validator: Validator;
  message: string | null;
  valid: boolean;

  /**
   * Return validation message if provided
   */
  getMessage(): string;
  /**
   * Adds optional data using for generate validation message and during validation
   */
  addData(key: string, value: unknown): void;
  validate(value: any): Promise<{ valid: boolean; message: string }>;
}
