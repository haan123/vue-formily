import { VueConstructor } from 'vue';
import { FormSchema } from './core/elements/types';
import { ValidationRuleSchema, VueFormilyOptions } from './types';
import { merge } from './utils';
import { registerElement } from './helpers';
import { Form, Field, Group, Collection } from './core/elements';

const defaultOptions: VueFormilyOptions = {
  alias: 'forms'
};

export default class VueFormily {
  readonly alias: string;
  readonly rules?: ValidationRuleSchema[];

  vm: any;

  constructor(options: VueFormilyOptions = {}) {
    const { alias, rules } = merge({}, defaultOptions, options) as VueFormilyOptions;

    this.alias = alias as string;
    this.rules = rules;
  }

  addForm(schema: FormSchema) {
    schema.rules = merge([], this.rules, schema.rules);

    const form = new Form(schema);

    this.vm.$set(this.vm[this.alias], form.formId, {
      fields: form.fields
    });

    return form;
  }

  removeForm(formId: string) {
    delete this.vm[this.alias][formId];
  }

  setInstance(vm: any) {
    this.vm = vm;
  }

  static install(Vue: VueConstructor, options?: VueFormilyOptions) {
    if (Vue.prototype.$vf) {
      return;
    }

    // initialize default form elements
    [Group, Collection, Field].forEach(F => {
      registerElement(F);

      if ('acceptOptions' in F) {
        F.acceptOptions(options);
      }
    });

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
