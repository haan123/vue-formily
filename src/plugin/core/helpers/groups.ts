import FormField from '../FormField';
import FormGroups from '../FormGroups';
import FormGroup from '../FormGroup';
import { FormilyFieldSchema, FormilyField, FormFieldSchema } from '../types';
import { logMessage } from '../utils';

export function toFields(fields: FormilyFieldSchema[], parent?: FormilyField): FormilyField[] {
  return fields.map(schema => {
    if (schema.type === 'form') {
      throw new Error(logMessage('Form can not be nested'));
    }

    if (schema.type === 'group') {
      return new FormGroup(schema, parent);
    } else if (schema.type === 'groups') {
      return new FormGroups(schema, parent);
    } else {
      return new FormField(schema as FormFieldSchema, parent);
    }
  });
}
