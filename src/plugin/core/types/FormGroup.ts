import { FormElement, FormGroupSchema, FormilyField } from '.';
import { FormType } from './Form';

export type FormGroupType = 'group' | FormType;

export declare class FormGroup extends FormElement {
  constructor(schema: FormGroupSchema, parent?: FormilyField);

  readonly type: FormGroupType;
  fields: FormilyField[];

  getField(path: string | string[], fields?: FormilyField[]): FormilyField | null;
}
