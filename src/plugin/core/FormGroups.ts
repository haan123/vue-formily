import { FORM_TYPE_GROUPS, FORM_TYPE_GROUP } from './constants';
import FormElement from './FormElement';
import FormGroup from './FormGroup';
import FormGroupsItem from './FormGroupsItem';
import {
  cascadeRules,
  genProps,
  getHtmlNameGenerator,
  indentifySchema,
  invalidateSchemaValidation,
  registerHtmlNameGenerator
} from './helpers';
import { FormGroupSchema, FormGroupsSchema, FormContainer, SchemaValidation, FormElementData } from './types';
import { def, isPlainObject, logMessage, Ref, setter } from './utils';

function normalizeGroupSchema(group: any) {
  return {
    formType: FORM_TYPE_GROUP,
    ...group
  };
}

registerHtmlNameGenerator({
  formType: FORM_TYPE_GROUPS,
  template(this: FormGroups, keysPath: string[]) {
    const [root, ...rest] = keysPath;

    if (!rest) {
      return `${root}[]`;
    }

    return `${root}[${rest.join('][')}]`;
  }
});

type FormGroupsData = FormElementData;
const _privateData = new WeakMap<FormGroups, FormGroupsData>();

export default class FormGroups extends FormElement {
  static accept(schema: any): SchemaValidation {
    const { identified, sv } = indentifySchema(schema, FORM_TYPE_GROUPS);

    if (!identified) {
      if (schema.formType !== FORM_TYPE_GROUPS) {
        invalidateSchemaValidation(sv, `"type" value must be ${FORM_TYPE_GROUPS}`, { formId: schema.formId });
      } else {
        const accepted = FormGroup.accept(normalizeGroupSchema(schema.group));

        if (!accepted.valid) {
          invalidateSchemaValidation(sv, `invalid group schema, ${accepted.reason}`, accepted.infos);
        }
      }

      if (sv.valid) {
        schema.__is__ = FORM_TYPE_GROUPS;
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

  groups: FormGroupsItem[] | null;
  value!: Exclude<FormGroup['value'], null>[] | null;

  constructor(schema: FormGroupsSchema, parent?: FormContainer) {
    super(schema, parent);

    const accepted = FormGroups.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, accepted.infos));
    }

    def(this, 'formType', FORM_TYPE_GROUPS, { writable: false });

    this.groups = null;

    if (schema.rules) {
      schema.group.fields = cascadeRules(schema.rules, schema.group.fields);
    }

    def(this, '_schema', normalizeGroupSchema(schema.group), { writable: false });

    this.props = genProps([schema.props], this);

    setter(this, 'value', null, (val: any, refValue: Ref) => {
      let value: FormGroups['value'] = null;

      if (Array.isArray(val)) {
        value = val;
      } else if (isPlainObject(val)) {
        value.push(val);
      } else {
        value = [val];
      }

      refValue.value = value;

      this.parent && this.parent.sync(this);
    });
  }

  initialize(schema: FormGroupsSchema, parent: FormContainer | null, data: FormGroupsData) {
    _privateData.set(this, data);
  }

  sync(group: FormGroupsItem) {
    if (!group.valid) {
      this.value && this.value.splice(group.index, 1);
    }
  }

  getHtmlName(): string {
    const gen = getHtmlNameGenerator(FORM_TYPE_GROUPS);

    return gen.genName(this, (_privateData.get(this) as FormGroupsData).ancestors);
  }

  isValid(): boolean {
    return !!(this.groups && this.groups.find(g => !g.valid));
  }

  addGroup() {
    if (!this.groups) {
      this.groups = [];
    }

    const index = this.groups.length;
    const group = new FormGroupsItem(
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
