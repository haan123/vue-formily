import { FormElement, FormGroupSchema, FormilyField } from '.';

export declare class FormGroup extends FormElement {
  constructor(schema: FormGroupSchema, parent?: FormilyField);

  fields: FormilyField[];
  /**
   * Use for group instance in FormGroups
   */
  index?: number;

  getField(path: string | string[], fields?: FormilyField[]): FormilyField | null;
}
