import VueFormily from './VueFormily';

export { Form, Field, Group, Collection } from './core/elements';
export { Validation, Rule } from './core/validations';

export default VueFormily;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueFormily);
}
