import { FormElementData, FormGroupSchema, FormGroupsSchema } from './types';

import FormElement from './FormElement';
import FormGroup from './FormGroup';
import FormGroupsItem from './FormGroupsItem';
import { cascadeRules, genHtmlName, genProps, indentifySchema, invalidateSchemaValidation } from '../../helpers';
import { def, logMessage } from '../../utils';

function normalizeGroupSchema(group: any) {
  return {
    formType: FormGroup.FORM_TYPE,
    ...group
  };
}

const _privateData = new WeakMap<FormGroups, FormElementData>();

export default class FormGroups extends FormElement {
  static FORM_TYPE = 'groups';
  static accept(schema: any) {
    const { identified, sv } = indentifySchema(schema, FormGroups.FORM_TYPE);

    if (!identified) {
      if (schema.formType !== FormGroups.FORM_TYPE) {
        invalidateSchemaValidation(sv, `"type" value must be ${FormGroups.FORM_TYPE}`, { formId: schema.formId });
      } else {
        const accepted = FormGroup.accept(normalizeGroupSchema(schema.group));

        if (!accepted.valid) {
          invalidateSchemaValidation(sv, `invalid group schema, ${accepted.reason}`, accepted.infos);
        }
      }

      if (sv.valid) {
        schema.__is__ = FormGroups.FORM_TYPE;
      }
    }

    return sv;
  }

  static create(schema: any, ...args: any[]): FormGroups {
    return new FormGroups(schema, ...args);
  }

  readonly _schema!: FormGroupSchema;
  readonly props!: Record<string, any> | null;
  readonly formType!: 'groups';
  readonly type!: 'set';

  groups: FormGroupsItem[] | null;

  constructor(schema: FormGroupsSchema, ...args: any[]) {
    super(schema, ...args);

    const accepted = FormGroups.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, accepted.infos));
    }

    def(this, 'formType', FormGroups.FORM_TYPE, { writable: false });
    def(this, 'type', 'set', { writable: false });

    this.groups = null;

    if (schema.rules) {
      schema.group.fields = cascadeRules(schema.rules, schema.group.fields);
    }

    def(this, '_schema', normalizeGroupSchema(schema.group), { writable: false });

    this.props = genProps([schema.props], this);
  }

  initialize(schema: FormGroupsSchema, parent: any, data: FormElementData) {
    _privateData.set(this, data);
  }

  getHtmlName(): string {
    return genHtmlName(this, (_privateData.get(this) as FormElementData).ancestors);
  }

  isValid(): boolean {
    return !!(this.groups && this.groups.find(g => !g.valid));
  }

  addGroup(): number {
    if (!this.groups) {
      this.groups = [];
    }

    const groupItem = new FormGroupsItem(
      {
        ...this._schema,
        formId(this: FormGroupsItem) {
          return `${(this.parent as FormGroups).formId}${this.index}`;
        }
      },
      this
    );

    return this.groups.push(groupItem);
  }
}
