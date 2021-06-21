import Formily from './Formily';
import install from './install';

export * from './core/elements';
export * from './core/validations';

const VueFormily = { install, Formily };

export { install, Formily, VueFormily };

export default VueFormily;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueFormily);
}
