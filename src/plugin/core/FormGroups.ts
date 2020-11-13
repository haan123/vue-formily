import { FORM_GROUPS_TYPE, FORM_GROUP_TYPE } from './constants';
import FormElement from './FormElement';
import FormGroup from './FormGroup';
import { cascadeRules, genProps, indentifySchema, invalidateSchemaValidation } from './helpers';
import {
  FormilyField,
  FormGroupSchema,
  FormGroupsSchema,
  PropValue,
  FormFieldValue,
  FormContainer,
  SchemaValidation
} from './types';
import { def, logMessage } from './utils';

function normalizeGroupSchema(group: any) {
  return {
    type: FORM_GROUP_TYPE,
    ...group
  };
}

export default class FormGroups extends FormElement {
  static accept(schema: any): SchemaValidation {
    const { identified, sv } = indentifySchema(schema, FORM_GROUPS_TYPE);

    if (!identified) {
      if (schema.type !== FORM_GROUPS_TYPE) {
        invalidateSchemaValidation(sv, `"type" value must be ${FORM_GROUPS_TYPE}`);
      } else {
        const accepted = FormGroup.accept(normalizeGroupSchema(schema.group));

        if (!accepted.valid) {
          invalidateSchemaValidation(sv, `invalid group schema, ${accepted.reason}`);
        }
      }

      if (sv.valid) {
        schema.__is__ = FORM_GROUPS_TYPE;
      }
    }

    return sv;
  }

  static create(schema: any, ...args: any[]): FormGroups {
    return new FormGroups(schema, ...args);
  }

  readonly _schema!: FormGroupSchema;
  readonly props!: Record<string, PropValue> | null;
  readonly type!: 'groups';

  groups: FormGroup[] | null;

  value: Record<string, any>[] | null;

  constructor(schema: FormGroupsSchema, parent?: FormContainer) {
    super(schema, parent);

    const accepted = FormGroups.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, { formId: this.formId }));
    }

    def(this, 'type', FORM_GROUPS_TYPE, { writable: false });

    this.groups = null;

    if (schema.rules) {
      schema.group.fields = cascadeRules(schema.rules, schema.group.fields);
    }

    def(this, '_schema', normalizeGroupSchema(schema.group), { writable: false });

    this.props = genProps([schema.props], this);

    let _value: Record<string, FormFieldValue>[] | null = null;

    def(this, 'value', (val: any) => {
      if (Array.isArray(val)) {
        _value = val;
      } else if (_value) {
        _value.push(val);
      } else {
        _value = [val];
      }

      console.log(val);
      return _value;
    });

    this.value = _value;
  }

  _sync(field: FormilyField) {}

  genHtmlName(path: string[], ...args: any[]) {
    if (!this.parent) {
      return `${this.formId}[${path.join('][')}]`;
    } else if (!this.parent.parent) {
      return `${this.parent.formId}[${this.formId}][${path.join('][')}]`;
    }

    return this.parent.genHtmlName([this.formId, ...path], ...args);
  }

  isValid(): boolean {
    return !!(this.groups && this.groups.find(g => !g.valid));
  }

  addGroup() {
    if (!this.groups) {
      this.groups = [];
    }

    const index = this.groups.length;
    const group = new FormGroup(
      {
        ...this._schema,
        formId: `${this.formId}${index}`
      },
      this,
      index
    );

    this.groups.push(group);
  }
}
