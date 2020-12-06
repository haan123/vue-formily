export type PropValue<T> = T | ((...args: any[]) => T);

export type ValidationRuleResult = {
  valid: boolean;
  message: string | null;
};

export type Validator = (
  value: any,
  props: Record<string, any>,
  data: Map<string, any> | null
) => boolean | Promise<boolean>;

export interface RuleSchema {
  validate?: Validator;
  validatable?: (this: ValidationRule, form: Form, vm: Vue) => boolean;
  types?: string[];
  props?: Record<string, any>;
  message?: ValidationMessageTemplate;
  cascade?: boolean;
  inherit?: boolean;
  allowEmpty?: boolean;
}

export type ValidationRuleSchema = Validator | RuleSchema;
