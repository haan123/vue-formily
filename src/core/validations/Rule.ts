import { RuleSchema, RuleResult, Validator, ValidationMessage } from './types';

import { def, isCallable, isPlainObject, logMessage, isEmpty, setter, isNonEmptyString } from '../../utils';
import { Objeto } from '../Objeto';
import { getPlug, emit } from '../../helpers';
import { LOCALIZER } from '../../constants';

let count = 0;

type Data = {};
let _storage: WeakMap<Rule, Data>;

export type RuleOptions = {
  data?: any;
};

export default class Rule extends Objeto {
  readonly props!: Record<string, any>;
  readonly name!: string;
  readonly data!: Record<string, any>;
  message!: ValidationMessage | null;
  validator!: Validator;
  valid!: boolean;
  error!: string | null;

  constructor(rule: Rule | RuleSchema | Validator, options: RuleOptions = {}) {
    super();

    let vProps;
    let message = null;

    if (isCallable(rule)) {
      this.validator = rule;
    } else if (isPlainObject(rule) && rule.validator) {
      if (!('allowEmpty' in rule) || rule.allowEmpty) {
        this.validator = rule.validator;
      } else if (!rule.allowEmpty) {
        this.validator = (value: any, props: Record<string, any>, data: Record<string, any> = {}) => {
          return !isEmpty(value) && (!rule.validator || (rule.validator as Validator).call(this, value, props, data));
        };
      }

      vProps = rule.props;

      message = isCallable(rule.message) ? rule.message : (isNonEmptyString(rule.message) ? rule.message : null);
    } else {
      throw new Error(logMessage('Missing rule\'s validator'));
    }

    def(this, 'data', options.data || {}, { writable: true });
    def(this, 'name', rule.name || `r${count++}`);
    def(this, 'props', vProps || {});
    def(this, 'message', message, { writable: true });
    setter(this, 'error', null, this.setError);
  }

  setError(error: any) {
    if (isNonEmptyString(error)) {
      const localizer = getPlug(LOCALIZER)

      if (localizer) {
        return localizer(error, this.props, this.data)
      }

      return error
    }

    return null;
  }

  reset() {
    this.valid = true;
    this.error = null;
  }

  _setup(storage: any) {
    _storage = storage;
    _storage.set(this, {} as Data);
  }

  addData(key: string, value: any) {
    this.data[key] = value;
  }

  async validate(value: any): Promise<RuleResult> {
    const message = this.message;


    const result = await this.validator(value, this.props, this.data);
    let error = null;
    let valid = true;

    if (result === false) {
      if (message) {
        error = isCallable(message) ? message(value, this.props, this.data) : message;
      }

      valid = false;
    } else if (isNonEmptyString(result)) {
      error = result;
      valid = false;
    }

    this.error = error;
    this.valid = valid;

    const ret = {
      error,
      valid
    };

    emit(this, 'validated', ret)

    return ret;
  }
}
