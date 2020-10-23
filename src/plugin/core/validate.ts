import { FormFieldType, FormFieldValue, ValidationResult, Validations } from './types';
import { isNumber } from './utils';

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

export function validate(
  value: unknown,
  validations: Validations,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const keys = Object.keys(validations);
  const errors = [];
  const failedRules: Record<string, string> = {};

  keys.forEach(async (key: string) => {
    const validation = validations[key];
    const valid = await validation.validate(value);

    if (!valid) {
      errors.push();
    }
  });

  return {
    valid: !!errors.length,
    failedRules
  };
}
