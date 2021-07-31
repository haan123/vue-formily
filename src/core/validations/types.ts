export interface ValidationMessageGenerator {
  (value: any, props?: Record<string, any>, ...args: any[]): string | null;
}

export type ValidationMessage = string | ValidationMessageGenerator | null;

export type Validator = (value: any, props: any, ...args: any[]) => string | boolean | Promise<string | boolean>;

export interface RuleSchema {
  validator?: Validator;
  name?: string;
  props?: any;
  message?: ValidationMessage;
  allowEmpty?: boolean;
  cast?: (value: any) => any;
}

export interface ValidationOptions {
  bails?: boolean;
}
