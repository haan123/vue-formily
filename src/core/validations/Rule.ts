import { RuleSchema, Validator, ValidationMessage } from './types';

import {
  def,
  isCallable,
  isPlainObject,
  logMessage,
  isEmpty,
  setter,
  isString,
  isNotEmptyString,
  getter,
  Ref,
  ref
} from '../../utils';
import { Objeto } from '../Objeto';
import { getPlug } from '../../helpers';
import { LOCALIZER } from '../../constants';

let count = 0;

export type RuleOptions = {
  data?: any;
};

type RuleData = {
  error: Ref<string | null>;
  valid: Ref<boolean>;
  data: Record<string, any>;
  message: Ref<ValidationMessage>;
};

export default class Rule extends Objeto {
  readonly props!: Record<string, any>;
  readonly name!: string;
  readonly data!: Record<string, any>;
  protected _d!: RuleData;
  valid!: boolean;
  error!: string | null;
  message!: ValidationMessage;
  validator!: Validator;

  constructor(rule: Rule | RuleSchema | Validator, options: RuleOptions = {}) {
    super();

    let vProps;

    def(this, 'name', rule.name || `r${count++}`);

    let validator = null;

    const message = (this._d.message = ref(null));

    if (isCallable(rule)) {
      validator = rule;
    } else if (isPlainObject(rule)) {
      validator = rule.validator || null;

      if ('allowEmpty' in rule && !rule.allowEmpty) {
        validator = (value: any, props: Record<string, any>, data: Record<string, any> = {}) => {
          return !isEmpty(value) && (!rule.validator || (rule.validator as Validator).call(this, value, props, data));
        };
      }

      vProps = rule.props;

      this.setMessage(rule.message);
    }

    if (!validator) {
      throw new Error(logMessage('Missing validator for rule'));
    }

    this.validator = validator;

    this._d.data = options.data || {};
    this._d.error = ref(null);
    this._d.valid = ref(true);

    def(this, 'props', vProps || {});

    getter(this, 'data', this._d.data);
    getter(this, 'error', this._d.error);
    getter(this, 'valid', this._d.valid);

    setter(this, 'message', message, this.setMessage);
  }

  setMessage(message?: ValidationMessage) {
    this._d.message.value = isCallable(message) || isNotEmptyString(message) ? message : null;
  }

  reset() {
    this._d.error.value = null;
    this._d.valid.value = true;
  }

  addData(key: string, value: any) {
    this._d.data[key] = value;
  }

  async validate(value: any): Promise<Rule> {
    const localizer = getPlug(LOCALIZER);
    const result = await this.validator(value, this.props, this.data);
    let error = null;
    let valid = true;

    if (result === false) {
      const message = this.message;

      error = isCallable(message) ? message.call(this, value, this.props, this.data) : message;
      valid = false;
    } else if (isString(result)) {
      error = result;
      valid = false;
    }

    this._d.error.value = localizer ? localizer(error, this.props, this.data) : error;
    this._d.valid.value = valid;

    this.emit('validated', this);

    return this;
  }
}
