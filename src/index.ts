import VueFormily from './VueFormily';

export * from './core/elements';
export * from './core/validations';

export default VueFormily;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueFormily);
}
