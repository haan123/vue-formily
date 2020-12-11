export interface ValidationMessageGenerator {
  (value: any, props: Record<string, any>, data: Map<string, any> | null): string;
}

export type ValidationMessageTemplate = string | ValidationMessageGenerator;

export type ValidationRuleResult = {
  error: string | null;
};

export type Validator = (
  value: any,
  props: Record<string, any>,
  data: Map<string, any> | null
) => boolean | Promise<boolean>;

export interface RuleSchema {
  validate?: Validator;
  props?: Record<string, any>;
  message?: ValidationMessageTemplate;
  allowEmpty?: boolean;
}

export interface ValidationOptions {
  bails?: boolean;
}

export type ValidationResult = {
  errors: string[] | null;
};
