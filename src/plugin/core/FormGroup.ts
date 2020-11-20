import { FORM_TYPE_GROUP } from './constants';
import FormElement from './FormElement';
import {
  cascadeRules,
  genProps,
  genValidationRules,
  getHtmlNameGenerator,
  indentifySchema,
  invalidateSchemaValidation,
  registerHtmlNameGenerator,
  traverseFields
} from './helpers';
import { genFields } from './helpers/groups';
import {
  FormContainer,
  FormElementData,
  FormGroupSchema,
  FormGroupValue,
  FormilyElements,
  SchemaValidation,
  ValidationResult
} from './types';
import { def, isPlainObject, logError, logMessage, Ref, setter } from './utils';
import Validation from './Validation';

registerHtmlNameGenerator({
  formType: FORM_TYPE_GROUP,
  template(this: FormGroup, keysPath: string[]) {
    const [root, ...rest] = keysPath;
    console.log(keysPath)

    if (!rest) {
      return `${root}`;
    }

    return `${root}[${rest.join('][')}]`;
  }
});

type FormGroupData = FormElementData;
const _privateData = new WeakMap<FormGroup, FormGroupData>();

export default class FormGroup extends FormElement {
  static accept(schema: any): SchemaValidation {
    const { identified, sv } = indentifySchema(schema, FORM_TYPE_GROUP);

    if (!identified) {
      if (schema.formType !== FORM_TYPE_GROUP) {
        invalidateSchemaValidation(sv, `'formType' must be '${FORM_TYPE_GROUP}'`, { formId: schema.formId });
      } else if (!schema.fields || !schema.fields.length) {
        invalidateSchemaValidation(sv, "'fields' is empty or missing", { formId: schema.formId });
      }

      if (sv.valid) {
        schema.__is__ = FORM_TYPE_GROUP;
      }
    }

    return sv;
  }

  static create(schema: any, ...args: any[]): FormGroup {
    return new FormGroup(schema, ...args);
  }

  readonly props!: Record<string, any> | null;
  readonly formType!: 'group';

  fields: FormilyElements[];
  value!: FormGroupValue;

  constructor(schema: FormGroupSchema, parent: FormContainer | null = null) {
    super(schema, parent);

    const accepted = FormGroup.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, accepted.infos));
    }

    def(this, 'formType', FORM_TYPE_GROUP, { writable: false });

    if (schema.rules) {
      schema.fields = cascadeRules(schema.rules, schema.fields);
    }

    this.fields = genFields(schema.fields, this);

    const props = (this.props = genProps([schema.props], this));

    const validationRules = genValidationRules(schema.rules, props, this.type, this);

    def(this, 'validation', new Validation(validationRules, { field: this }), { writable: false });

    setter(this, 'value', null, (val: any, refValue: Ref) => {
      let value: Record<string, any> | null = null;

      if (val !== null) {
        if (!isPlainObject(val)) {
          logError(`Group value must be an object of { ${this.fields.map(f => f.model).join(', ')} }`, {
            formId: this.formId
          });
        } else {
          value = this.value || {};
          const length = this.fields.length;

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
        }
      }

      refValue.value = value;

      this.parent && this.parent.sync(this);
    });
  }

  initialize(schema: FormGroupSchema, parent: FormContainer | null, data: FormGroupData) {
    _privateData.set(this, data);
  }

  getHtmlName(): string {
    const gen = getHtmlNameGenerator(FORM_TYPE_GROUP);

    return gen.genName(this, (_privateData.get(this) as FormGroupData).ancestors);
  }

  // genHtmlName(path: string[], ...args: any[]) {
  //   if (!this.parent) {
  //     return `${this.formId}[${path.join('][')}]`;
  //   }

  //   path.unshift(this.formId);

  //   return this.parent.genHtmlName(path, ...args);
  // }

  isValid(): boolean {
    return !this.invalidated() && !this.fields.find(f => !f.valid);
  }

  getField(path: string | string[] = [], fields?: FormilyElements[]): FormilyElements | null {
    return traverseFields(path, fields || this.fields);
  }

  async validate(val: any): Promise<ValidationResult> {
    const result = await this.validation.validate(val);

    return result;
  }

  sync(field: FormilyElements) {
    if (!field.valid) {
      this.value = null;
    } else if (field.value !== undefined) {
      this.value = {
        [field.model]: field.value
      };
    }
  }
}
