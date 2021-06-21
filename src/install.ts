import { VueConstructor } from 'vue';
import { VueFormilyOptions } from './types';
import { Field, Group, Collection } from './core/elements';
import Formily from './Formily';

export default function install(Vue: VueConstructor, options?: VueFormilyOptions) {
  if (Vue.prototype.$formily) {
    return;
  }

  // initialize default form elements
  [Group, Collection, Field].forEach(F => F.register(options));

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
        [formily.alias]: {}
      };
    }
  });
}
