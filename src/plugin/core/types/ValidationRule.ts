import { Form, ValidationMessageTemplate, ValidationProps } from '.';
import { ValidationRuleResult } from '../ValidationRule';

export type Validator = (
  value: any,
  props: ValidationProps,
  data: Map<string, any> | null
) => boolean | Promise<boolean>;
export interface RuleSchema {
  validate?: Validator;
  validatable?: (this: ValidationRule, form: Form, vm: Vue) => boolean;
  types?: string[];
  props?: Record<string, any>;
  message?: ValidationMessageTemplate;
  cascade?: boolean;
  inherit?: boolean;
  allowEmpty?: boolean;
}

export type ValidationRuleSchema = Validator | RuleSchema;

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
