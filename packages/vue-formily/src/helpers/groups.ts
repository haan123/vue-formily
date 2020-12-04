import { FormilySchemas, FormilyElements, FormElementConstructor } from '../../types';
import { logMessage } from '../utils';

const _formElements: FormElementConstructor[] = [];

export function registerFormElement(F: FormElementConstructor) {
  if (!_formElements.includes(F)) {
    _formElements.push(F);
  }
}

export function genFields(fields: FormilySchemas[], ...args: any[]): FormilyElements[] {
  const length = _formElements.length;
  let invalidSchema: FormilySchemas;

  return fields.map(schema => {
    for (let i = 0; i < length; i++) {
      const F = _formElements[i];
      const accepted = F.accept(schema);

      if (accepted.valid) {
        return F.create(schema, ...args);
      }

      invalidSchema = schema;
    }

    throw new Error(
      logMessage(
        `Failed to create form elmenent, caused by schema:\n ${JSON.stringify(invalidSchema, null, 2).slice(
          0,
          50
        )}\n\t...\n`
      )
    );
  });
}
