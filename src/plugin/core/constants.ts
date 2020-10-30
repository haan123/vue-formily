import { FormFieldType, FormGroupType, FormType } from './types';

export const FORM_GROUP_TYPE: FormGroupType = 'group';
export const FORM_TYPE: FormType = 'form';
export const FORM_GROUPS_TYPE = 'groups';
export const FORM_FIELD_TYPES: Record<string, FormFieldType> = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'date'
};
