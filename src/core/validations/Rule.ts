import { RuleSchema, ValidationMessageTemplate, RuleResult, Validator } from './types';

import { def, isCallable, isPlainObject, logMessage, isEmpty, valueOrNull, setter, isNonEmptyString } from '../../utils';
import { getLocalizer } from '@/helpers';
import { Objeto } from '../Objeto';

const localizer = getLocalizer();
let count = 0;

type Data = {
  validator: Validator;
  template?: ValidationMessageTemplate | null;
};
let _storage: WeakMap<Rule, Data>;

export type RuleOptions = {
  data?: any;
};

export default class Rule extends Objeto {
  readonly props!: Record<string, any>;
  readonly name!: string;
  readonly data!: Record<string, any>;
  valid!: boolean;
  error!: string | null;

  constructor(rule: Rule | RuleSchema | Validator, options: RuleOptions = {}) {
    super();

    if (!rule) {
      throw new Error(logMessage('Missing validation rule when creating validation'));
    }

    const _data = _storage.get(this) as Data;
    let vProps;

    if (isCallable(rule)) {
      _data.validator = rule;
    } else if (isPlainObject(rule)) {
      if (!('allowEmpty' in rule) || rule.allowEmpty) {
        _data.validator = valueOrNull(rule.validate);
      } else if (!rule.allowEmpty) {
        _data.validator = (value: any, props: Record<string, any>, data: Record<string, any> | null) => {
          return !isEmpty(value) && (!rule.validate || (rule.validate as Validator).call(this, value, props, data));
        };
      }

      vProps = rule.props;
      _data.template = isCallable(rule.error) ? rule.error : (!isNonEmptyString(rule.error) ? rule.error : null);
    }

    if (!_data.validator) {
      throw new Error(logMessage('Missing "validate(): boolean" method in validation rule'));
    }

    def(this, 'data', options.data || {}, { reactive: false });
    def(this, 'name', rule.name || `r${count++}`, { writable: false });
    def(this, 'props', vProps || {}, { writable: false });

    setter(this, 'error', null, (error: any) => isNonEmptyString(error) ? localizer(error, this.props, this.data) : null)
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
    const { validator, template } = _storage.get(this) as Data;
    const result = await validator.call(this, value, this.props, this.data);
    let error = null;
    let valid = true;

    if (result === false) {
      if (template) {
        error = isCallable(template) ? template(value, this.props, this.data) : template;
      }

      valid = false;
    } else if(isNonEmptyString(result)) {
      error = result;
      valid = false;
    }

    this.error = error;
    this.valid = valid;

    return {
      error,
      valid
    };
  }
}
