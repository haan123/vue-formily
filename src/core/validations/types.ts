export interface ValidationMessageGenerator {
  (value: any, props: Record<string, any>, data: Record<string, any> | null): string;
}

export type ValidationMessage = string | ValidationMessageGenerator;

export type RuleResult = {
  error: string | null;
  valid: boolean;
};

export type Validator = (
  value: any,
  props: Record<string, any>,
  data: Record<string, any> | null
) => string | boolean | Promise<string | boolean>;

export interface RuleSchema {
  validate?: Validator;
  name?: string;
  props?: Record<string, any>;
  message?: ValidationMessage;
  allowEmpty?: boolean;
  cast?: (value: any) => any;
}

export interface ValidationOptions {
  bails?: boolean;
}

export type ValidationResult = {
  errors: string[] | null;
  valid: boolean;
};
