export interface ValidationMessageGenerator {
  (value: any, props: Record<string, any>, data: Record<string, any> | null): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export type RuleResult = {
  error: string | null;
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
  error?: ValidationMessageTemplate;
  allowEmpty?: boolean;
}

export interface ValidationOptions {
  bails?: boolean;
}

export type ValidationResult = {
  errors: string[] | null;
};
