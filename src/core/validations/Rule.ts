import { RuleSchema, Validator, ValidationMessage, ValidationMessageGenerator } from './types';

import { def, isCallable, isPlainObject, logMessage, isEmpty, setter, isNonEmptyString, Ref, ref } from '../../utils';
import { Objeto } from '../Objeto';
import { getPlug, emit } from '../../helpers';
import { LOCALIZER } from '../../constants';

let count = 0;

export type RuleOptions = {
  data?: any;
};

function normalizeError(error?: ValidationMessage | null): ValidationMessageGenerator | null {
  return error ? (isCallable(error) ? error : () => error) : null;
}

export default class Rule extends Objeto {
  readonly props!: Record<string, any>;
  readonly name!: string;
  readonly data!: Record<string, any>;
  validator!: Validator;
  valid!: boolean;
  error!: string | null;

  constructor(rule: Rule | RuleSchema | Validator, options: RuleOptions = {}) {
    super();

    let vProps;
    const error = ref(() => null);

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

      error.value = normalizeError(rule.error);
    } else {
      throw new Error(logMessage('Missing rule\'s validator'));
    }

    def(this, 'data', options.data || {}, { writable: true });
    def(this, 'name', rule.name || `r${count++}`);
    def(this, 'props', vProps || {});
    def(this, 'valid', true, { writable: true });
    setter(this, 'error', error, this.setError);

    this._d.error = error;
  }

  setError(error?: ValidationMessage) {
    let _error = normalizeError(error);
    const localizer = getPlug(LOCALIZER);

    if (_error) {
      this._d.error.value = _error;
    } else {
      _error = this._d.error.value;
    }

    const template = (_error as ValidationMessageGenerator).call(this, this.props, this.data);

    return localizer ? localizer(template, this.props, this.data) : template;
  }

  reset() {
    this.valid = true;
    this.setError(null);
  }

  addData(key: string, value: any) {
    this.data[key] = value;
  }

  async validate(value: any): Promise<Rule> {
    const result = await this.validator(value, this.props, this.data);

    this.reset();

    if (result === false) {
      this.setError();

      this.valid = false;
    } else if (isNonEmptyString(result)) {
      this.setError(result);
      this.valid = false;
    }

    emit(this, 'validated', this)

    return this;
  }
}
