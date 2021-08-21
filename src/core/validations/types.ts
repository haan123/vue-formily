export type Validator = (value: any, ...args: any[]) => string | boolean | Promise<string | boolean>;

export interface RuleSchema {
  validator?: Validator;
  name?: string;
  message?: string;
}

export interface ValidationOptions {
  bails?: boolean;
}
