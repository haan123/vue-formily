import Formily from './Formily';

export default Formily;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Formily);
}
