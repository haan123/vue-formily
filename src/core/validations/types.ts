export interface ValidationMessageGenerator {
  (props?: Record<string, any>, data?: Record<string, any> | null): string | null;
}

export type ValidationMessage = string | ValidationMessageGenerator;

export type Validator = (
  value: any,
  props: Record<string, any>,
  data: Record<string, any>
) => string | boolean | Promise<string | boolean>;

export interface RuleSchema {
  validator?: Validator;
  name?: string;
  props?: Record<string, any>;
  error?: ValidationMessage;
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
