import { FormFieldType, FormGroupsType, FormGroupType } from './types';

export const FORM_FIELD_TYPES: Record<string, FormFieldType> = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'date'
};

export const FORM_GROUP_TYPE: FormGroupType = 'group';
export const FORM_GROUPS_TYPE: FormGroupsType = 'groups';
