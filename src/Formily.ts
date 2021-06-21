import { FormSchema } from './core/elements/types';
import { ValidationRuleSchema, VueFormilyOptions } from './types';
import { merge } from './utils';
import { Form } from './core/elements';

const defaultOptions: VueFormilyOptions = {
  alias: 'forms'
};

export default class Formily {
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

    this.vm.$set(this.vm[this.alias], form.formId, form);

    return form;
  }

  removeForm(formId: string) {
    delete this.vm[this.alias][formId];
  }

  setInstance(vm: any) {
    this.vm = vm;
  }
}
