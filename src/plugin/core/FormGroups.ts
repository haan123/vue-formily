import FormElement from './FormElement';
import FormGroup from './FormGroup';
import { cascadeRules, toProps } from './helpers';
import { FormilyField, FormGroupSchema, FormGroupsSchema, PropValue, FormFieldValue, FormContainer } from './types';
import { def, logMessage } from './utils';

export default class FormGroups extends FormElement {
  static accept(schema: any): schema is FormGroupsSchema {
    return 'group' in schema && FormGroup.accept(schema.group);
  }

  static create(schema: any, ...args: any[]): FormGroups {
    return new FormGroups(schema, ...args);
  }

  readonly _schema!: FormGroupSchema;
  readonly props!: Record<string, PropValue> | null;

  groups: FormGroup[] | null;

  value!: Record<string, FormFieldValue>[] | null;

  constructor(schema: FormGroupsSchema, parent?: FormContainer) {
    super(schema, parent);

    if (!FormGroups.accept(schema)) {
      throw new Error(logMessage('Invalid form groups schema', { formId: this.formId }));
    }

    this.groups = null;

    if (schema.rules) {
      schema.group.fields = cascadeRules(schema.rules, schema.group.fields);
    }

    def(this, '_schema', schema.group, { writable: false });

    this.props = toProps(this, schema.props);

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

    return this.parent.genHtmlName([...path, this.formId], ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initialize() {}

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
