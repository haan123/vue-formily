import { VueConstructor } from 'vue';
import { VFFieldSchema, FormilyOptions } from './core/types';
import Form from './core/Form';

export default class Formily {
  static version = '__VERSION__';

  vm: any;

  add(formSchema: VFFieldSchema[], options?: FormilyOptions) {
    const form = new Form(formSchema, options);

    this.vm.$set(this.vm.forms, form.name, {
      models: form.models,
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
