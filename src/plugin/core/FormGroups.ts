import FormElement from './FormElement';
import FormGroup from './FormGroup';
import { FormilyField, FormGroupSchema, FormGroupsType } from './types';
import { def } from './utils';

export default class FormGroups extends FormElement {
  readonly _schema!: FormGroupSchema;
  readonly type!: FormGroupsType;
  groups: FormGroup[];

  constructor(schema: FormGroupSchema, parent?: FormilyField) {
    super(schema.formId, parent);

    this.groups = [];

    def(this, '_schema', schema, false);
    def(this, 'type', 'groups', false);
  }

  addGroup() {
    const group = new FormGroup(this._schema, this, this.groups.length);

    this.groups.push(group);
  }
}
