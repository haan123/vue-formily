import { VueConstructor } from 'vue';
import { FormSchema, FormilyOptions } from '../types';
import Form from './core/Form';
import { merge } from './utils';
import { maxLength, minLength, min, max } from './rules';
import { registerFormElement } from './helpers/groups';

import FormField from './core/FormField';
import FormGroups from './core/FormGroups';
import FormGroup from './core/FormGroup';

const defaultOptions: FormilyOptions = {
  rules: {
    minLength,
    maxLength,
    min,
    max
  }
};

export default class Formily {
  static version = '__VERSION__';

  readonly options: FormilyOptions;

  vm: any;

  constructor(options: FormilyOptions = {}) {
    this.options = merge({}, defaultOptions, options);
  }

  add(schema: FormSchema) {
    const { rules } = this.options;

    schema.rules = merge({}, this.options.rules, rules);

    const form = new Form(schema);

    this.vm.$set(this.vm.forms, form.formId, {
      fields: form.fields
    });

    return form;
  }

  setInstance(vm: any) {
    this.vm = vm;
  }

  static install(Vue: VueConstructor, options?: FormilyOptions) {
    if (Vue.prototype.$formily) {
      return;
    }

    // Initialize default form elements
    [FormField, FormGroup, FormGroups].forEach(F => registerFormElement(F));

    const formily = new Formily(options);

    Object.defineProperty(Vue.prototype, '$formily', {
      get() {
        formily.setInstance(this);
        return formily;
      }
    });

    Vue.mixin({
      data() {
        return {
          forms: {}
        };
      }
    });
  }
}
