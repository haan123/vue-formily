import { VueConstructor } from 'vue';
import { FormSchema, FormilyOptions, RuleSchema } from './core/types';
import Form from './core/Form';
import { merge } from './core/utils';
import { maxLength, minLength, min, max } from './core/rules';

import FormField from './core/FormField';
import FormGroups from './core/FormGroups';
import FormGroup from './core/FormGroup';
import { registerFormElement } from './core/helpers/groups';

const defaultRules: Record<string, RuleSchema> = {
  minLength,
  maxLength,
  min,
  max
};

export default class Formily {
  static version = '__VERSION__';

  readonly options?: FormilyOptions;

  vm: any;

  constructor(options?: FormilyOptions) {
    this.options = options;
  }

  add(schema: FormSchema, options?: FormilyOptions) {
    const { rules } = merge({}, this.options, options);

    schema.rules = merge({}, defaultRules, rules);

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
