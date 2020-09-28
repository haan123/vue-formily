import { VueConstructor } from 'vue';
import Formily from './Formily'

export default function install(Vue: VueConstructor) {
  if (Vue.prototype.$formily) {
    return;
  }

  const formily = new Formily()

  Object.defineProperty(Vue.prototype, '$formily', {
    get() {
      formily.setInstance(this)

      return formily;
    }
  });

  Vue.mixin({
    data() {
      return {
        forms: {}
      };
    },
  });
}
