import { FormGroupSchema, FormilyField } from '.';
import { FormElement } from './FormElement';
import { FormGroup } from './FormGroup';

export type FormGroupsType = 'groups';

export declare class FormGroups extends FormElement {
  private constructor(schema: FormGroupSchema, parent?: FormilyField);

  readonly _schema: FormGroupSchema;
  readonly type: FormGroupsType;
  groups: FormGroup[];

  addGroup(): void;
}
