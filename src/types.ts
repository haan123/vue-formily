import { RuleSchema, Validator } from './core/validations/types';
import { CalendarOptions } from './utils/Calendar';

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
  rules?: ValidationRuleSchema[];
  alias?: string;
  localizer?: Localizer;
  stringFormatter?: (format: string, data: Record<string, any>) => string;
  dateTimeFormatter?: (format: string, input: any, options?: CalendarOptions) => string;
}

export type Localizer = (value: string, props?: Record<string, any>, data?: Record<string, any>) => string;
