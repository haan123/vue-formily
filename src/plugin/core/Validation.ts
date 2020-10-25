import { RuleSchema, ValidationMessageTemplate, ValidationRule, ValidationRuleSchema, Validator } from './types';
import { def, each, isCallable, logWarn } from './utils';

function normalizeRuleSchema(schema: ValidationRuleSchema): RuleSchema | null {
  let ruleSchema = null;

  if (isCallable(schema)) {
    ruleSchema = {
      validate: schema,
      cascade: false;
    };
  } else if (!schema.types) {
    logWarn(`Missing "types" in validation rule with name "${propName}"`);
  } else if (schema.types.includes(this.type)) {
    const validation = new Validation(schema, (this as Record<string, any>)[propName], {
      field: this
    });

    if (validation) {
      def(this, 'validation', validation, false);
    }
  }

  return ruleSchema;
}

export default class Validation {
  readonly rules!: Record<string, ValidationRule>;
  readonly errors!: string[];

  constructor(schemas: Record<string, ValidationRuleSchema>, data?: unknown) {
    each(schemas, (schema: ValidationRuleSchema, propName: string) => {
      const { types } = schema;

      if (!types) {
        logWarn(`Missing "types" in validation rule with name "${propName}"`);
      } else if (types.includes(this.type)) {
        const validation = new Validation(schema, (this as Record<string, any>)[propName], {
          field: this
        });

        if (validation) {
          def(this, 'validation', validation, false);
        }
      }
    });

  }

  addRule(key: string, ruleOrSchema: ValidationRule | ValidationRuleSchema) {
    if (ruleOrSchema instanceof ValidationRule) {
      this.rules[key] = ruleOrSchema;
    } else {

    }
  }

  async validate(
    value: unknown
  ): Promise<{
    valid: boolean;
    message: string | null;
  }> {
    const valid = await this._validator(value, this.params, this.data);
    let message = null;

    if (isCallable(this._template)) {
      message = this._template(value, this.params, this.data);
    } else if (typeof this._template === 'string') {
      message = this._template;
    }

    return {
      valid,
      message
    };
  }
}
