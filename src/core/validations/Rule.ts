import { RuleSchema, Validator } from './types';

import { dumpProp, isCallable, isPlainObject, isString, readonlyDumpProp, now, valueOrNull } from '../../utils';
import { Objeto } from '../Objeto';
import { getPlug } from '../../helpers';
import { LOCALIZER } from '../../constants';

type RuleData = {
  error: string | null;
  valid: boolean;
};

export default class Rule extends Objeto {
  readonly name!: string;
  protected _d!: RuleData;
  message!: string | null;
  validator?: Validator | null;

  constructor(rule: Rule | RuleSchema | Validator) {
    super();

    readonlyDumpProp(this, 'name', rule.name || now());

    dumpProp(this, 'message', null);

    const data = this._d;

    data.error = null;
    data.valid = true;

    if (isCallable(rule)) {
      this.validator = rule;
    } else if (isPlainObject(rule)) {
      this.validator = rule.validator;

      this.setMessage(rule.message as string);
    }
  }

  get valid() {
    return this._d.valid;
  }

  get error() {
    return this._d.error;
  }

  setMessage(message?: string) {
    this.message = valueOrNull(message);
  }

  reset() {
    this._d.error = null;
    this._d.valid = true;
  }

  async validate(value: any, props: Record<string, any> = {}, ...args: any[]): Promise<Rule> {
    const translater = getPlug(LOCALIZER);
    const data = this._d;

    let error = null;
    let valid = true;
    let result: string | boolean = true;

    if (isCallable(this.validator)) {
      result = await this.validator(value, props, ...args);
    }

    this.emit('validate', this);

    if (result === false || isString(result)) {
      error = result || this.message;
      valid = false;
    }

    data.error = translater && isString(error) ? translater.translate(error, ...args) : error;
    data.valid = valid;

    this.emit('validated', this);

    return this;
  }
}
