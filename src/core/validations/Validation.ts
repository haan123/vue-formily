import { RuleSchema, Validator } from './types';
import { findIndex, getter, isNumber } from '../../utils';
import Rule, { RuleOptions } from './Rule';
import { Objeto } from '../Objeto';

type ValitionRuleSchema = Validator | RuleSchema;

export type ExtValidation<K extends string> = Validation & {
  [key in K]: Rule;
}


export type ValidationOptions = RuleOptions & {
  data?: any;
  from?: number;
};

export default class Validation extends Objeto {
  readonly valid!: boolean;
  readonly errors!: string[] | null;
  rules: Rule[] = [];

  constructor(rules?: ValitionRuleSchema[], options: ValidationOptions = {}) {
    super();

    if (rules) {
      this.addRules(rules, options);
    }

    getter(this, 'valid', this.isValid);
    getter(this, 'errors', this.getErrors);
  }

  isValid() {
    return !this.rules.some((rule) => !rule.valid)
  }

  getErrors() {
    if (this.isValid()) {
      return null;
    }

    const errors = this.rules.map((rule) => rule.error).filter((error) => error)

    return errors.length ? errors : null;
  }

  addRules(rulesOrSchemas: (Rule | ValitionRuleSchema)[], { from, ...options }: ValidationOptions = {}): Rule[] {
    from = isNumber(from) ? from++ : -Infinity;

    return rulesOrSchemas.map((schema: Rule | ValitionRuleSchema, index: number) => {
      return this.addRule(schema, { from: (from as number)++, ...options })
    });
  }

  removeRules(removes: (Rule | string)[]): Rule[] {
    return removes.map((remove) => this.removeRule(remove));
  }

  addRule(ruleOrSchema: Rule | ValitionRuleSchema, { from, ...options }: ValidationOptions = {}): Rule {
    const rule = new Rule(ruleOrSchema, options);
    const currentRule = (this as ExtValidation<any>)[rule.name]

    if (currentRule) {
      this.removeRule(currentRule)
    }

    const length = this.rules.length;

    this.rules.splice(isNumber(from) && from >= 0 && from <= length ? from : length, 0, rule);

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
    const { excluded, picks } = options;

    this.emit('validate', value, this);

    if (this.rules) {
      let rules = picks ? this.rules.filter(({ name }) => picks.includes(name)) : this.rules;
      rules = excluded ? rules.filter(({ name }) => !excluded.includes(name)) : rules;

      await Promise.all(
        rules.map(async rule => await rule.validate(value))
      );
    }

    this.emit('validated',  value, this);

    return this;
  }
}
