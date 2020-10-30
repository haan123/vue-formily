import { FORM_GROUP_TYPE } from './constants';
import FormElement from './FormElement';
import { cascadeRules, genHtmlName, traverseFields } from './helpers';
import { toFields } from './helpers/groups';
import { FormGroupSchema, FormGroupType, FormilyField } from './types';
import { def, logMessage } from './utils';

export default class FormGroup extends FormElement {
  readonly type!: FormGroupType;
  fields: FormilyField[];

  constructor(schema: FormGroupSchema, parent?: FormilyField, index?: number) {
    super(schema, parent, index);

    def(this, 'type', FORM_GROUP_TYPE, false);

    if (!schema.fields || !schema.fields.length) {
      throw new Error(logMessage('Missing "fields", please provide a "fields" property in your schema'));
    }

    if (schema.rules) {
      schema.fields = cascadeRules(schema.rules, schema.fields);
    }

    // this should not read only because we want nested fields reactivable
    this.fields = toFields(schema.fields, this);
  }

  initialize() {
    def(this, 'htmlName', genHtmlName(this), false);
  }

  getField(path: string | string[] = [], fields?: FormilyField[]): FormilyField | null {
    return traverseFields(path, fields || this.fields);
  }
}
