import { FormilyFieldSchema, FormilyField, FormElementConstructor } from '../types';
import { logMessage } from '../utils';

const _formElements: FormElementConstructor[] = [];

export function registerFormElement(F: FormElementConstructor) {
  if (!_formElements.includes(F)) {
    _formElements.push(F);
  }
}

export function genFields(fields: FormilyFieldSchema[], ...args: any[]): FormilyField[] {
  const length = _formElements.length;

  return fields.map(schema => {
    for (let i = 0; i < length; i++) {
      const F = _formElements[i];
      const accepted = F.accept(schema);

      if (accepted.valid) {
        return F.create(schema, ...args);
      }
    }

    throw new Error(
      logMessage('Failed to create form elmenent', {
        formId: schema.formId
      })
    );
  });
}
