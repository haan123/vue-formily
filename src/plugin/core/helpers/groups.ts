import { FormilyFieldSchema, FormilyField, FormElementConstructor } from '../types';

const _formElements: FormElementConstructor[] = [];

export function registerFormElement(F: FormElementConstructor) {
  if (!_formElements.includes(F)) {
    _formElements.push(F);
  }
}

export function toFields(fields: FormilyFieldSchema[], ...args: any[]): FormilyField[] {
  return fields.map(schema => {
    const length = _formElements.length;

    for (let i = 0; i < length; i++) {
      const F = _formElements[i];

      if (F.accept(schema)) {
        return F.create(schema, ...args);
      }
    }

    throw new Error('Can not create form Element');
  });
}
