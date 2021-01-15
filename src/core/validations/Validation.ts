import { RuleSchema, ValidationResult, Validator } from './types';
import { getter, logMessage, ref, Ref } from '../../utils';
import Rule, { RuleOptions } from './Rule';
import { Objeto, reactiveGetter } from '../Objeto';

type ValitionRuleSchema = Validator | RuleSchema;

export type ExtValidation<K extends string> = Validation & {
  [key in K]: Rule;
}

type Data = {
  valid: Ref<boolean>;
};
let _storage: WeakMap<Validation, Data>;

export type ValidationOptions = {
  data?: any;
};

export default class Validation extends Objeto {
  readonly errors: string[] | null = null;
  readonly valid!: boolean;
  rules: Rule[] = [];

  constructor(rules?: ValitionRuleSchema[], options: ValidationOptions = {}) {
    super();

    if (rules) {
      this.addRules(rules, options);
    }

    const _data = _storage.get(this) as Data;

    reactiveGetter(this, 'errors', this.rules.map(({ error }) => error));
    reactiveGetter(this, 'valid', _data.valid);
  }

  addRules(rulesOrSchemas: (Rule | ValitionRuleSchema)[], options: ValidationOptions = {}): Rule[] {
    return rulesOrSchemas.map((schema: Rule | ValitionRuleSchema) => this.addRule(schema, { data: options.data } ));
  }

  removeRules(removes: (Rule | string)[]): Rule[] {
    return removes.map((remove) => this.removeRule(remove));
  }

  addRule(ruleOrSchema: Rule | ValitionRuleSchema, options: RuleOptions= {}): Rule {
    const rule = new Rule(ruleOrSchema, options);
    const found = this.rules.find((r) => r.name === rule.name);

    if (!found) {
      this.rules = this.rules ? [...this.rules, rule] : [rule];
    } else {
      throw new Error(logMessage(`Rule "${rule.name}" is already added.`));
    }

    getter(this, rule.name, rule)

    return rule;
  }

  removeRule(remove: Rule | string) {
    const index = this.rules.findIndex(({ name }) => {
      const n = remove instanceof Rule ? remove.name : remove;

      return name === n;
    });

    const [removed] = index !== -1 ? this.rules.splice(index, 1) : [];

    delete this[removed.name as keyof Validation];

    return removed;
  }

  initData(storage: any) {
    _storage = storage;
    _storage.set(this, {
      valid: ref(true)
    } as Data);
  }

  reset() {
    this.rules.forEach((rule) => rule.reset());
  }

  async validate(value: any, options: { excluded?: string[] } = {}): Promise<ValidationResult> {
    const errors: string[] = [];
    const data = _storage.get(this) as Data;
    const { excluded } = options;
    let valid = true;

    if (this.rules) {
      const rules = excluded ? this.rules.filter(({ name }) => !excluded.includes(name)) : this.rules;

      await Promise.all(
        rules.map(async rule => {
          const result = await rule.validate(value);

          if (!result.valid) {
            if (result.error) {
              errors.push(result.error);
            }

            valid = false;
          }
        })
      );
    }

    data.valid.value = valid;

    return {
      errors,
      valid
    };
  }
}
