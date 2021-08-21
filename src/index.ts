import Formily from './Formily';
import install from './install';

export * from './core/elements';
export * from './core/validations';
export * from './helpers/plugs';
export { registerElement, unregisterElement } from './helpers/elements';

const VueFormily = { install, Formily };

export { install, Formily, VueFormily };

export default VueFormily;
