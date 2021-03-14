import { RuleSchema, Validator, ValidationMessage } from './types';

import { def, isCallable, isPlainObject, logMessage, isEmpty, setter, isString, ref, Ref, isNotEmptyString } from '../../utils';
import { Objeto } from '../Objeto';
import { getPlug } from '../../helpers';
import { LOCALIZER } from '../../constants';

let count = 0;

export type RuleOptions = {
  data?: any;
};

type RuleData = {
  error: Ref<string | null>;
  message: Ref<ValidationMessage>;
};

function genMessage(rule: Rule) {
  return `${rule.name}_invalid`;
}

export default class Rule extends Objeto {
  readonly props!: Record<string, any>;
  readonly name!: string;
  readonly data!: Record<string, any>;
  readonly error!: string | null;
  protected _d!: RuleData;
  message!: ValidationMessage;
  validator!: Validator;

  constructor(rule: Rule | RuleSchema | Validator, options: RuleOptions = {}) {
    super();

    let vProps;

    def(this, 'name', rule.name || `r${count++}`);

    const error = ref(null)
    const message = ref(genMessage(this));
    let validator = null;

    this._d.error = error;
    this._d.message = message;

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

    def(this, 'props', vProps || {});
    def(this, 'data', options.data || {}, { writable: true });

    setter(this, 'message', message, this.setMessage)
    setter(this, 'error', error, this.setError);
  }

  setMessage(message?: ValidationMessage) {
    this._d.message.value = isCallable(message) || isNotEmptyString(message) ? message : genMessage(this);
  }

  setError(message: string | null) {
    const localizer = getPlug(LOCALIZER);

    const error = localizer ? localizer(message, this.props, this.data) : message;

    this._d.error.value = error;
  }

  reset() {
    this.setError(null);
  }

  addData(key: string, value: any) {
    this.data[key] = value;
  }

  async validate(value: any): Promise<Rule> {
    const result = await this.validator(value, this.props, this.data);
    const message = this.message;
    let error = null;

    this.reset();

    if (result === false) {
      error = isCallable(message) ? message.call(this, value, this.props, this.data) : message;
    } else if (isString(result)) {
      error = result
    }

    this.setError(error);

    this.emit('validated', this)

    return this;
  }
}
