import { camelCase, isObject, isPlainObject, readOnlyDef } from './utils';
import { reactor } from './observer';
import { toFields, traverseFields } from './FormGroup';
import { VFField, VFFieldSchema, FormilyOptions } from './types';
import FormElement from './FormElement';

/**
 * Data types:
 *   number: 1 || 1.0
 *   string: 'abc'
 *   boolean: true || false
 *   date: MM/dd/yyyy : h: mm a
 */

/**
 * [
 *  {
 *    name: string;
 *    value: any;
 *    model: string;
 *    ?fields: array
 *    ...
 *  }
 * ]
 */
function toModels(fields: VFField[]) {
  const models = fields.reduce((acc, field) => {
    const model = camelCase(field.name);

    reactor(acc, model, field, field.value);

    return acc;
  }, {});

  return models;
}

let uid = 0;

export default class Form extends FormElement {
  /**
   * The ID of the form element. The is is unique within the parent element of the form.
   */
  readonly formId!: string;
  _uid: number;
  _schema: VFFieldSchema[];
  name: string;
  fields: VFField[];
  models: object;
  validations: object;

  constructor(form: VFFieldSchema[], options: FormilyOptions = {}) {
    super(options.name);

    this._uid = uid++;
    this._schema = form;

    readOnlyDef(this, 'formId', `vf${form._uid}`);

    this.name = options.name || `vf${this._uid}`;
    this.fields = toFields(this._schema, this);
    this.models = toModels(this.fields);
    this.validations = this.toFormValidations(this._schema);
  }

  toFormValidations(fields: VFFieldSchema[]) {
    return fields.reduce((acc: { [key: string]: any }, field) => {
      const { validations, fields } = field;
      const fieldName = camelCase(field.name);

      if (field.collection) {
        acc[fieldName] = {
          $each: this.toFormValidations(fields)
        };
      } else if (field.nested) {
        acc[fieldName] = this.toFormValidations(fields);
      } else if (validations) {
        const validators: { [key: string]: any } = {};

        Object.keys(validations).forEach(key => {
          const validator = validations[key];

          if (typeof validator === 'function') {
            validators[key] = validator;
          } else {
            validators[key] = validator.validator;
          }
        });

        acc[fieldName] = validators;
      }

      return acc;
    }, {});
  }

  mergeModels(cb: (parent: any, key: string) => void) {
    const recurse = (parent: any) => {
      Object.keys(parent).forEach(key => {
        if (isPlainObject(parent)) {
          recurse(parent[key]);
        }

        cb(parent, key);
      });
    };

    recurse(this.models);
  }

  getField(path = [], fields?: VFField[]): VFField {
    return traverseFields(path, fields || this.fields);
  }

  getFieldSchema(path = [], fields?: VFFieldSchema[]): VFFieldSchema {
    return traverseFields(path, fields || this._schema);
  }

  // getMessageFormats(fieldSchema, error, data) {
  //   if (!isObject(fieldSchema)) {
  //     fieldSchema = this.getFieldSchema(fieldSchema);
  //   }

  //   const { validations } = fieldSchema;
  //   const validator = validations[error.type];
  //   let prefix = '';
  //   let formats = {};

  //   if (!validations || !validator || !validator.messageFormats) {
  //     return {
  //       prefix,
  //       formats
  //     };
  //   }

  //   ({ prefix, ...formats } = validator.messageFormats);

  //   Object.keys(formats).reduce((acc, key) => {
  //     const formatter = formats[key];

  //     if (typeof formatter === 'function') {
  //       acc[key] = formatter.call(this, data, { error, fieldSchema });
  //     } else {
  //       acc[key] = formatter;
  //     }

  //     return acc;
  //   }, formats);

  //   return {
  //     prefix,
  //     formats
  //   };
  // }
}
