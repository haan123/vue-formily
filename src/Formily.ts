import { FormSchema } from './core/elements/types';
import { VueFormilyOptions } from './types';
import { merge } from './utils';
import { Form } from './core/elements';

const defaultOptions: VueFormilyOptions = {
  alias: 'forms'
};

export default class Formily {
  options: VueFormilyOptions;
  vm: any;

  constructor(options: VueFormilyOptions = {}) {
    this.options = merge({}, defaultOptions, options) as VueFormilyOptions;
  }

  addForm(schema: FormSchema) {
    const { vm, options } = this;

    schema.rules = merge([], options.rules, schema.rules);

    const form = new Form(schema);

    form.addProp('_formy', {
      vm() {
        return this.vm;
      }
    });

    vm.$set(this.vm[options.alias as string], form.formId, form);

    return form;
  }

  removeForm(formId: string) {
    delete this.vm[this.options.alias as string][formId];
  }

  setInstance(vm: any) {
    this.vm = vm;
  }
}
