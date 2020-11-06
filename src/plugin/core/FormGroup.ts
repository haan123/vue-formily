import FormElement from './FormElement';
import { cascadeRules, traverseFields } from './helpers';
import { toFields } from './helpers/groups';
import { FormContainer, FormGroupSchema, FormilyField, PropValue } from './types';
import { def, isPlainObject, logError, logMessage, Ref, setter } from './utils';

export default class FormGroup extends FormElement {
  static accept(schema: any): schema is FormGroupSchema {
    return 'fields' in schema;
  }

  static create(schema: any, ...args: any[]): FormGroup {
    return new FormGroup(schema, ...args);
  }

  readonly index!: number | null;
  readonly props!: Record<string, PropValue> | null;

  fields: FormilyField[];
  value!: Record<string, any> | null;

  constructor(schema: FormGroupSchema, parent?: FormContainer, index?: number) {
    super(schema, parent, index);

    if (!schema.fields || !schema.fields.length) {
      throw new Error(logMessage('Invalida schema, missing "fields" property'));
    }

    if (schema.rules) {
      schema.fields = cascadeRules(schema.rules, schema.fields);
    }

    this.fields = toFields(schema.fields, this);

    setter(this, 'value', null, (val: any, refValue: Ref) => {
      if (!isPlainObject(val)) {
        logError('Invalid group value, "object" is expected');
      } else {
        let value: Record<string, any> | null = {};

        this.fields.forEach((field: FormilyField) => {
          const v = val[field.model];

          if (field.value !== v) {
            field.value = v;
          } else if (value && field.valid) {
            value[field.model] = v;
          } else {
            value = null;
          }
        });

        refValue.value = value;
      }
    });
  }

  initialize(schema: FormGroupSchema, index: number) {
    def(this, 'index', index !== undefined ? index : null);
  }

  genHtmlName(path: string[], ...args: any[]) {
    if (!this.parent) {
      return `${this.formId}[${path.join('][')}]`;
    }

    path.unshift(...(this.index !== null ? [this.parent.formId, '' + this.index] : [this.formId]));

    return this.parent.genHtmlName(path, ...args);
  }

  isValid(): boolean {
    return !this._invalidated || !!this.fields.find(f => !f.valid);
  }

  getField(path: string | string[] = [], fields?: FormilyField[]): FormilyField | null {
    return traverseFields(path, fields || this.fields);
  }

  _sync(field: FormGroup) {
    if (!field.valid) {
      return;
    }

    this.value = {
      [field.model]: field.value
    };
  }
}
