import { VueConstructor } from 'vue';
import { FormSchema } from './core/elements/types';
import { VueFormilyOptions } from './types';
import { merge } from './utils';
import { maxLength, minLength, min, max } from './rules';
import { registerElement } from './helpers/elements';
import { Form, Field, Group, Collection } from './core/elements';

const defaultOptions: VueFormilyOptions = {
  rules: {
    minLength,
    maxLength,
    min,
    max
  }
};

export default class VueFormily {
  static version = '__VERSION__';

  readonly options: VueFormilyOptions;

  vm: any;

  constructor(options: VueFormilyOptions = {}) {
    this.options = merge({}, defaultOptions, options);
  }

  add(schema: FormSchema) {
    const { rules } = this.options;

    schema.rules = merge({}, this.options.rules, rules);

    const form = new Form(schema);

    this.vm.$set(this.vm.$forms, form.formId, {
      fields: form.fields
    });

    return form;
  }

  setInstance(vm: any) {
    this.vm = vm;
  }

  static install(Vue: VueConstructor, options?: VueFormilyOptions) {
    if (Vue.prototype.$formily) {
      return;
    }

    // Initialize default form elements
    [Field, Group, Collection].forEach(F => registerElement(F));

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
          $forms: {}
        };
      }
    });
  }
}
