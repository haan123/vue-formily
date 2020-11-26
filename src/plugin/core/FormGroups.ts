import FormElement from './FormElement';
import FormGroup from './FormGroup';
import FormGroupsItem from './FormGroupsItem';
import { cascadeRules, genHtmlName, genProps, indentifySchema, invalidateSchemaValidation } from './helpers';
import { FormGroupSchema, FormGroupsSchema, SchemaValidation, FormElementData } from './types';
import { def, isPlainObject, logError, logMessage, Ref, setter } from './utils';

function normalizeGroupSchema(group: any) {
  return {
    formType: FormGroup.FORM_TYPE,
    ...group
  };
}

type FormGroupsData = FormElementData;
const _privateData = new WeakMap<FormGroups, FormGroupsData>();

export default class FormGroups extends FormElement {
  static FORM_TYPE = 'groups';
  static accept(schema: any): SchemaValidation {
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
  value!: Exclude<FormGroup['value'], null>[] | null;

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

    const isEnum = this._schema.fields.length > 1;

    setter(this, 'value', null, (val: any, refValue: Ref) => {
      let value: FormGroups['value'] = null;

      if (Array.isArray(val)) {
        value = [];

        this.addGroup();

        for (let i = 0; i < length; i++) {
          const field = this.fields[i];
          const v = val[field.model] !== undefined ? val[field.model] : field.value;

          if (!field.valid) {
            value = null;
            break;
          } else if (field.value !== v) {
            field.value = v;
            break;
          } else {
            value[field.model] = v;
          }
        }
        value = val;
      } else if (value && value.length && isPlainObject(val)) {
        value.push(val);
      } else {
        value = [val];
      }


      refValue.value = value;

      this.parent && this.parent.sync(this);
    });
  }

  initialize(schema: FormGroupsSchema, parent: any, data: FormGroupsData) {
    _privateData.set(this, data);
  }

  sync(groupItem: FormGroupsItem) {
    if (!groupItem.valid) {
      this.value = null;
    } else if (this.groups) {
      this.value = this.groups.map(groupItem => groupItem.value as Exclude<FormGroupsItem, null>);
    }
  }

  getHtmlName(): string {
    return genHtmlName(this, (_privateData.get(this) as FormGroupsData).ancestors);
  }

  isValid(): boolean {
    return !!(this.groups && this.groups.find(g => !g.valid));
  }

  addGroup(value?: any): number {
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

    if (value !== undefined) {
      groupItem.value = value;
    }

    return this.groups.push(groupItem);
  }
}
