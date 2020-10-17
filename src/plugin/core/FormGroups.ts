import FormElement from './FormElement';
import FormGroup from './FormGroup';
import { FormilyField, FormGroupSchema, FormGroupsType, FormGroupsSchema } from './types';
import { def } from './utils';

export default class FormGroups extends FormElement {
  static TYPE = 'groups';

  readonly _schema!: FormGroupsSchema;
  readonly type!: FormGroupsType;
  groups: FormGroup[];

  constructor(schema: FormGroupsSchema, parent?: FormilyField) {
    super(schema.formId, parent);

    this.groups = [];

    def(this, '_schema', schema, false);
    def(this, 'type', FormGroups.TYPE, false);
  }

  addGroup() {
    const schema: FormGroupSchema = {
      ...this._schema,
      type: 'group'
    };
    const group = new FormGroup(schema, this, this.groups.length);

    this.groups.push(group);
  }
}
