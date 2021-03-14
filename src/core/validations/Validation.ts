import { RuleSchema, Validator } from './types';
import { findIndex, getter } from '../../utils';
import Rule, { RuleOptions } from './Rule';
import { Objeto } from '../Objeto';

type ValitionRuleSchema = Validator | RuleSchema;

export type ExtValidation<K extends string> = Validation & {
  [key in K]: Rule;
}


export type ValidationOptions = {
  data?: any;
};

export default class Validation extends Objeto {
  readonly errors!: string[] | null;
  rules: Rule[] = [];

  constructor(rules?: ValitionRuleSchema[], options: ValidationOptions = {}) {
    super();

    if (rules) {
      this.addRules(rules, options);
    }

    getter(this, 'errors', this.getErrors);
  }

  getErrors() {
    const errors = this.rules.map(({ error }) => error).filter((error) => error);

    return errors.length ? errors : null;
  }

  addRules(rulesOrSchemas: (Rule | ValitionRuleSchema)[], options: ValidationOptions = {}): Rule[] {
    return rulesOrSchemas.map((schema: Rule | ValitionRuleSchema) => this.addRule(schema, { data: options.data } ));
  }

  removeRules(removes: (Rule | string)[]): Rule[] {
    return removes.map((remove) => this.removeRule(remove));
  }

  addRule(ruleOrSchema: Rule | ValitionRuleSchema, options: RuleOptions= {}): Rule {
    const rule = new Rule(ruleOrSchema, options);
    const currentRule = (this as ExtValidation<any>)[rule.name]

    if (currentRule) {
      this.removeRule(currentRule)
    }

    this.rules = this.rules ? [...this.rules, rule] : [rule];

    getter(this, rule.name, rule, { configurable: true })

    return rule;
  }

  removeRule(remove: Rule | string) {
    const index = findIndex(this.rules, ({ name }) => {
      const n = remove instanceof Rule ? remove.name : remove;

      return name === n;
    });

    const [removed] = index !== -1 ? this.rules.splice(index, 1) : [];

    delete this[removed.name as keyof Validation];

    return removed;
  }

  reset() {
    this.rules.forEach((rule) => rule.reset());
  }

  async validate(value: any, options: { excluded?: string[], picks?: string[] } = {}): Promise<Validation> {
    const errors: string[] = [];
    const { excluded, picks } = options;

    this.emit('validate', value, this);

    if (this.rules) {
      let rules = picks ? this.rules.filter(({ name }) => picks.includes(name)) : this.rules;
      rules = excluded ? rules.filter(({ name }) => !excluded.includes(name)) : rules;

      await Promise.all(
        rules.map(async rule => {
          const result = await rule.validate(value);

          if (result.error) {
            errors.push(result.error);
          }
        })
      );
    }

    this.emit('validated',  value, this);

    return this;
  }
}
