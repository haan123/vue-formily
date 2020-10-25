import { FormFieldType, FormFieldValue, ValidationResult, Validations } from './types';
import { Validation } from './types/Validation';
import { each, isNumber } from './utils';

export function cast(value: any, type: FormFieldType): FormFieldValue {
  let typedValue: FormFieldValue = null;

  if (type === 'string') {
    typedValue = '' + value;
  } else if (type === 'number') {
    if (!isNumber(value)) {
      throw new Error(`"${value}" is not a "number"`);
    }

    typedValue = +value;
  } else if (type === 'boolean') {
    typedValue = !!value;
  } else if (type === 'date') {
    try {
      typedValue = new Date(value);
    } catch (error) {
      throw new Error(`"${value}" is not a "date" value`);
    }
  }

  return typedValue;
}

interface ValidationOptions {
  bails?: boolean;
}

export async function validate(
  value: unknown,
  validations: Validations,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const errors: string[] = [];

  each(validations, async (validation: Validation) => {
    const { valid, message } = await validation.validate(value);

    if (!valid) {
      errors.push(message);
    }
  });

  return {
    valid: !!errors.length,
    errors
  };
}
