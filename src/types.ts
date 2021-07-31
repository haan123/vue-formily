import { RuleSchema, Validator } from './core/validations/types';
import { CalendarOptions } from './utils/Calendar';

export type ValidationRuleSchema =
  | Validator
  | (RuleSchema & {
      for?: string[];
      cascade?: boolean;
      inherit?: boolean;
    });

export type SchemaValidation = {
  valid: boolean;
  reason?: string;
  infos?: Record<string, string>;
};

export interface VueFormilyOptions {
  rules?: ValidationRuleSchema[];
  alias?: string;
  localizer?: Localizer;
  stringFormatter?: (format: string, data: any, options?: Record<string, any>) => string;
  dateTimeFormatter?: (format: string, data: any, options?: CalendarOptions) => string;
  plugins?: any[];
  elements?: any[];
}

export interface VueFormilyPlugin {
  name: string;
  install(): any;
  [key: string]: any;
}

export type Localizer = (value: string, props?: Record<string, any>, data?: Record<string, any>) => string;
