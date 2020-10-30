import { FORM_GROUPS_TYPE, FORM_GROUP_TYPE } from './constants';
import FormElement from './FormElement';
import FormGroup from './FormGroup';
import { cascadeRules, genHtmlName } from './helpers';
import { FormilyField, FormGroupSchema, FormGroupsSchema, FormGroupsType } from './types';
import { def, isNullOrUndefined, merge } from './utils';

export default class FormGroups extends FormElement {
  readonly _schema!: FormGroupSchema;
  readonly type!: FormGroupsType;

  groups: FormGroup[];

  constructor(schema: FormGroupsSchema, parent?: FormilyField) {
    super(schema, parent);

    def(this, 'type', FORM_GROUPS_TYPE, false);

    this.groups = [];

    if (!isNullOrUndefined(schema.rules)) {
      schema.fields = cascadeRules(schema.rules, schema.fields);
    }

    def(this, '_schema', merge({ type: FORM_GROUP_TYPE }, schema), false);
  }

  initialize() {
    def(this, 'htmlName', genHtmlName(this), false);
  }

  addGroup() {
    const group = new FormGroup(this._schema, this, this.groups.length);

    this.groups.push(group);
  }
}
