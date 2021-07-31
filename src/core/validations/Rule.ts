import { RuleSchema, Validator, ValidationMessage } from './types';

import {
  dumpProp,
  isCallable,
  isPlainObject,
  logMessage,
  isEmpty,
  isString,
  isNotEmptyString,
  readonlyDumpProp,
  now
} from '../../utils';
import { Objeto } from '../Objeto';
import { getPlug } from '../../helpers';
import { LOCALIZER } from '../../constants';

type RuleData = {
  error: string | null;
  valid: boolean;
  data: Record<string, any>;
};

export default class Rule extends Objeto {
  readonly props!: Record<string, any>;
  readonly name!: string;
  protected _d!: RuleData;
  message!: ValidationMessage;
  validator!: Validator;

  constructor(rule: Rule | RuleSchema | Validator) {
    super();

    let vProps;

    readonlyDumpProp(this, 'name', rule.name || now());

    let validator = null;

    dumpProp(this, 'message', null);

    if (isCallable(rule)) {
      validator = rule;
    } else if (isPlainObject(rule)) {
      validator = rule.validator || null;

      if ('allowEmpty' in rule && !rule.allowEmpty) {
        validator = (value: any, props: Record<string, any>) => {
          return !isEmpty(value) && (!rule.validator || (rule.validator as Validator).call(this, value, props));
        };
      }

      vProps = rule.props;

      this.setMessage(rule.message);
    }

    if (!validator) {
      throw new Error(logMessage('Missing validator for rule'));
    }

    this.validator = validator;

    const data = this._d;

    data.error = null;
    data.valid = true;

    readonlyDumpProp(this, 'props', vProps || {});
  }

  get valid() {
    return this._d.valid;
  }

  get error() {
    return this._d.error;
  }

  setMessage(message?: ValidationMessage) {
    this.message = isCallable(message) || isNotEmptyString(message) ? message : null;
  }

  reset() {
    this._d.error = null;
    this._d.valid = true;
  }

  async validate(value: any, ...args: any[]): Promise<Rule> {
    const localizer = getPlug(LOCALIZER);

    const result = await this.validator(value, this.props, ...args);

    let error = null;
    let valid = true;

    this.emit('validate', this);

    if (result === false) {
      const message = this.message;

      error = isCallable(message) ? message.call(this, value, this.props, ...args) : message;
      valid = false;
    } else if (isString(result)) {
      error = result;
      valid = false;
    }

    this._d.error = localizer ? localizer(error, this.props) : error;
    this._d.valid = valid;

    this.emit('validated', this);

    return this;
  }
}
