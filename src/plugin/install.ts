import { VueConstructor } from 'vue';
import Formily from './Formily';

export function install(Vue: VueConstructor, options: {}) {
  if (Vue.prototype.$formily) {
    return;
  }

  const plugin = (vm: any) => {
    return {
      add(formSchema, options) {
        const form = new Formily(formSchema, options);

        vm.$set(vm.forms, form.name, {
          models: form.models,
          fields: form.fields
        });

        return form;
      }
    };
  };

  Object.defineProperty(Vue.prototype, '$formily', {
    get() {
      return plugin(this);
    }
  });

  Vue.mixin({
    data() {
      return {
        forms: {}
      };
    },
    computed: {
      $forms() {
        return this.forms;
      }
    }
  });
}
