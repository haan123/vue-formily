import { FORM_GROUP_TYPE } from './constants';
import FormElement from './FormElement';
import {
  cascadeRules,
  genProps,
  genValidationRules,
  indentifySchema,
  invalidateSchemaValidation,
  traverseFields
} from './helpers';
import { genFields } from './helpers/groups';
import { FormContainer, FormGroupSchema, FormilyField, PropValue, SchemaValidation, ValidationResult } from './types';
import { def, isCallable, isPlainObject, logError, logMessage, Ref, setter } from './utils';
import Validation from './Validation';

export default class FormGroup extends FormElement {
  static accept(schema: any): SchemaValidation {
    const { identified, sv } = indentifySchema(schema, FORM_GROUP_TYPE);

    if (!identified) {
      if (schema.type !== FORM_GROUP_TYPE) {
        invalidateSchemaValidation(sv, `"type" value must be "${FORM_GROUP_TYPE}"`);
      } else if (!schema.fields || !schema.fields.length) {
        invalidateSchemaValidation(sv, '"fields" is empty or missing');
      }

      if (sv.valid) {
        schema.__is__ = FORM_GROUP_TYPE;
      }
    }

    return sv;
  }

  static create(schema: any, ...args: any[]): FormGroup {
    return new FormGroup(schema, ...args);
  }

  readonly index!: number | null;
  readonly props!: Record<string, PropValue> | null;
  readonly type!: 'group';

  fields: FormilyField[];
  value!: Record<string, any> | null;

  constructor(schema: FormGroupSchema, parent?: FormContainer, index?: number) {
    super(schema, parent);

    const accepted = FormGroup.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, { formId: this.formId }));
    }

    def(this, 'type', FORM_GROUP_TYPE, { writable: false });
    def(this, 'index', index !== undefined ? index : null);

    if (schema.rules) {
      schema.fields = cascadeRules(schema.rules, schema.fields);
    }

    this.fields = genFields(schema.fields, this);

    const props = (this.props = genProps([schema.props], this));

    const validationRules = genValidationRules(schema.rules, props, this.type, this);

    def(this, 'validation', new Validation(validationRules, { field: this }), { writable: false });

    setter(this, 'value', null, (val: any, refValue: Ref) => {
      console.log(val);
      if (!isPlainObject(val)) {
        logError(`Invalid group value, "object" is expected but got ${val}`);
      } else {
        let value: Record<string, any> | null = this.value || {};
        const length = this.fields.length;

        for (let i = 0; i < length; i++) {
          const field = this.fields[i];
          const v = val[field.model] !== undefined ? val[field.model] : field.value;

          if (!field.valid) {
            value = null;
            break;
          } else if (field.value !== v) {
            field.value = v;
          } else {
            value[field.model] = v;
          }
        }

        refValue.value = value;

        if (this.parent && isCallable(this.parent._sync)) {
          this.parent._sync(this);
        }
      }
    });
  }

  genHtmlName(path: string[], ...args: any[]) {
    if (!this.parent) {
      return `${this.formId}[${path.join('][')}]`;
    }

    path.unshift(...(this.index !== null ? ['' + this.index] : [this.formId]));

    return this.parent.genHtmlName(path, ...args);
  }

  isValid(): boolean {
    return !this._invalidated && !this.fields.find(f => !f.valid);
  }

  getField(path: string | string[] = [], fields?: FormilyField[]): FormilyField | null {
    return traverseFields(path, fields || this.fields);
  }

  async validate(val: any): Promise<ValidationResult> {
    const result = await this.validation.validate(val);

    return result;
  }

  _sync(field: FormGroup) {
    if (!field.valid) {
      this.value = null;
    } else {
      this.value = {
        [field.model]: field.value
      };
    }
  }
}
