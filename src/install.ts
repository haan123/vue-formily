import { VueConstructor } from 'vue';
import { VueFormilyOptions, VueFormilyPlugin } from './types';
import { Field, Group, Collection } from './core/elements';
import Formily from './Formily';
import { plug, registerElement } from './helpers';

export default function install(Vue: VueConstructor, options: VueFormilyOptions = {}) {
  if (Vue.prototype.$formily) {
    return;
  }

  const { elements = [], plugins = [], ..._options } = options;

  plugins.forEach((plugin: VueFormilyPlugin) => plug(plugin));

  // initialize default form elements
  [Group, Collection, Field, ...elements].forEach(F => registerElement(F, _options));

  const formily = new Formily(_options);

  Object.defineProperty(Vue.prototype, '$formily', {
    get() {
      formily.setInstance(this);
      return formily;
    }
  });

  Vue.mixin({
    data() {
      return {
        [formily.options.alias as string]: {}
      };
    }
  });
}
