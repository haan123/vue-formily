import { RuleSchema, Validator } from './core/validations/types';

export type ValidationRuleSchema =
  | Validator
  | (RuleSchema & {
      for?: string[];
      cascade?: boolean;
      inherit?: boolean;
    });

export type PropValue<T> = T | ((...args: any[]) => T);

export type SchemaValidation = {
  valid: boolean;
  reason?: string;
  infos?: Record<string, string>;
};

export interface ElementConstructor extends Function {
  accept(schema: any): SchemaValidation;
  create(schema: any, ...args: any[]): unknown;
}

export interface VueFormilyOptions {
  rules?: Record<string, RuleSchema>;
  alias?: string;
  localizer?: any;
}

export type Localizer = (value: string, props?: Record<string, PropValue<any>>, data?: Record<string, any>) => string
