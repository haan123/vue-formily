import { VueConstructor } from 'vue';
import { FormSchema, FormilyOptions } from './core/types';
import Form from './core/Form';

export default class Formily {
  static version = '__VERSION__';

  vm: any;

  add(schema: FormSchema, options?: FormilyOptions) {
    const form = new Form(schema, options);

    this.vm.$set(this.vm.forms, form.formId, {
      fields: form.fields
    });

    return form;
  }

  setInstance(vm: any) {
    this.vm = vm;
  }

  static install(Vue: VueConstructor) {
    if (Vue.prototype.$formily) {
      return;
    }

    const formily = new Formily();

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
