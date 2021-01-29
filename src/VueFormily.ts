import { VueConstructor } from 'vue';
import { FormSchema } from './core/elements/types';
import { ValidationRuleSchema, VueFormilyOptions } from './types';
import { merge } from './utils';
import { registerElement, plug } from './helpers';
import { Form, Field, Group, Collection } from './core/elements';
import {
  stringFormatter as defaultStringFormatter,
  dateTimeFormatters as defaultDateTimeFormatters
} from './utils/formatters';

const defaultOptions: VueFormilyOptions = {
  alias: 'forms'
};

export default class VueFormily {
  static version = '__VERSION__';

  readonly alias: string;
  readonly rules?: Record<string, ValidationRuleSchema>;

  vm: any;

  constructor(options: VueFormilyOptions = {}) {
    const _options = merge({}, defaultOptions, options);

    const { alias, rules, localizer, stringFormatter, dateTimeFormatters } = _options;

    this.alias = alias;
    this.rules = rules;

    plug('stringFormatter', stringFormatter || defaultStringFormatter);
    plug('dateTimeFormatters', dateTimeFormatters || defaultDateTimeFormatters);
  }

  add(schema: FormSchema) {
    schema.rules = merge({}, this.rules, schema.rules);

    const form = new Form(schema);

    this.vm.$set(this.vm[this.alias], form.formId, {
      fields: form.fields
    });

    return form;
  }

  setInstance(vm: any) {
    this.vm = vm;
  }

  static install(Vue: VueConstructor, options?: VueFormilyOptions) {
    if (Vue.prototype.$vf) {
      return;
    }

    // _initialize default form elements
    [Group, Collection, Field].forEach(F => registerElement(F));

    const vf = new VueFormily(options);

    Object.defineProperty(Vue.prototype, '$vf', {
      get() {
        vf.setInstance(this);
        return vf;
      }
    });

    Vue.mixin({
      data() {
        return {
          [vf.alias]: {}
        };
      }
    });
  }
}
