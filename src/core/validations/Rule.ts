import { RuleSchema, ValidationMessageTemplate, RuleResult, Validator } from './types';

import { def, isCallable, isPlainObject, logMessage, isEmpty, valueOrNull, setter } from '../../utils';
import { getLocalizer } from '@/helpers';

const localizer = getLocalizer();
let count = 0;

type Data = {
  validator: Validator;
  template?: ValidationMessageTemplate;
};
const _storage = new WeakMap<Rule, Data>();

export default class Rule {
  readonly props!: Record<string, any>;
  readonly name!: string;
  data!: Record<string, any>;
  error!: string | null;

  constructor(rule: Rule | RuleSchema | Validator, data?: any) {
    if (!rule) {
      throw new Error(logMessage('Missing validation rule when creating validation'));
    }

    const _data = {} as Data;
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
      _data.template = isCallable(rule.error) ? rule.error : valueOrNull(rule.error);
    }

    if (!_data.validator) {
      throw new Error(logMessage('Missing "validate(): boolean" method in validation rule'));
    }

    _storage.set(this, _data);

    def(this, 'data', data || {}, { reactive: false });
    def(this, 'name', rule.name || `r${count++}`, { writable: false });
    def(this, 'props', vProps || {}, { writable: false });

    setter(this, 'error', null, (error: any) => typeof error === 'string' ? localizer(error, this.props, this.data) : null)
  }

  addData(key: string, value: any) {
    this.data[key] = value;
  }

  async validate(value: any): Promise<RuleResult> {
    const { validator, template } = _storage.get(this) as Data;
    const result = await validator.call(this, value, this.props, this.data);
    let error = null;

    if(typeof result === 'string') {
      error = result;
    } else if (!result) {
      if (isCallable(template)) {
        error = template(value, this.props, this.data);
      } else if (typeof template === 'string') {
        error = template;
      }

      error = typeof error === 'string' ? error : 'validation.invalid';
    }

    this.error = error

    return {
      error
    };
  }
}
