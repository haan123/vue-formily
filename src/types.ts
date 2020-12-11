import { RuleSchema, Validator } from './core/validations/types';

export type ValidationRuleSchema =
  | Validator
  | (RuleSchema & {
      types?: string[];
      cascade?: boolean;
      inherit?: boolean;
      validatable?: (form: Record<string, any>, vm: Vue) => boolean;
    });

export type PropValue<T> = T | ((...args: any[]) => T);

export type SchemaValidation = {
  valid: boolean;
  reason?: string;
  infos?: Record<string, string>;
};

export interface FormElementConstructor extends Function {
  accept(schema: any): SchemaValidation;
  create(schema: any, ...args: any[]): unknown;
}

export interface VueFormilyOptions {
  rules?: Record<string, ValidationRuleSchema>;
}
