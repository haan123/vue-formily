import { FormGroupSchema, FormContainer, FormGroup } from './';

export declare class FormGroupsItem extends FormGroup {
  constructor(schema: FormGroupSchema, parent: FormContainer | null, index: number);

  index: number;
}
