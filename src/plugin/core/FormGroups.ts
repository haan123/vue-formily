import FormElement from './FormElement';
import FormGroup from './FormGroup';
import { cascadeRules } from './helpers';
import { FormGroupSchema, FormGroupsSchema, FormContainer } from './types';
import { def, logMessage } from './utils';

export default class FormGroups extends FormElement {
  static accept(schema: any): schema is FormGroupsSchema {
    return 'group' in schema;
  }

  static create(schema: any, ...args: any[]): FormGroups {
    return new FormGroups(schema, ...args);
  }

  readonly _schema!: FormGroupSchema;

  groups: FormGroup[];

  constructor(schema: FormGroupsSchema, parent?: FormContainer) {
    super(schema, parent);

    if (!schema.group) {
      throw new Error(
        logMessage('Invalid schema, missing "group" property', {
          formId: this.formId
        })
      );
    }

    this.groups = [];

    if (schema.rules) {
      schema.group.fields = cascadeRules(schema.rules, schema.group.fields);
    }

    def(this, '_schema', schema.group, false);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initialize() {}

  genHtmlName(path: string[], ...args: any[]): string {
    if (!this.parent) {
      return `${this.formId}[${path.join('][')}]`;
    }

    return this.parent.genHtmlName(path, ...args);
  }

  isValid(): boolean {
    return !!this.groups.find(g => !g.valid);
  }

  addGroup() {
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

  _sync() {

  }
}
