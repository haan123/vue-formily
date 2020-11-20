import { FormField, FormGroup, FormGroups, FormGroupsItem } from './types';

export const FORM_FIELD_TYPES: Record<string, FormField['type']> = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'date'
};
export const FORM_TYPE_FIELD: FormField['formType'] = 'field';
export const FORM_TYPE_GROUP: FormGroup['formType'] = 'group';
export const FORM_TYPE_GROUPS: FormGroups['formType'] = 'groups';
