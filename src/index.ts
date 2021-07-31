import Formily from './Formily';
import install from './install';

export * from './core/elements';
export * from './core/validations';

const VueFormily = { install, Formily };

export { install, Formily, VueFormily };

export default VueFormily;
