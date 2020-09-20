import { camelCase, isObject, isPlainObject } from './utils';
import { reactor } from './observer';
import { toFields, traverseFields } from './CollectionField';
import { FormilyField, FormilyFieldSchema, FormilyOptions, FormilySchema } from './types';

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
function toModels(fields: FormilyField[]) {
  const models = fields.reduce((acc, field) => {
    const model = camelCase(field.name);

    reactor(acc, model, field, field.value);

    return acc;
  }, {});

  return models;
}

let uid = 0;

export default class Formily {
  static install: () => void;

  static version = '1.0.0';

  _uid: number;
  _schema: FormilyFieldSchema[];
  name: string;
  fields: FormilyField[];
  models: object;
  validations: object;

  constructor(form: FormilyFieldSchema[], options: FormilyOptions = {}) {
    this._uid = uid++;
    this._schema = form;

    this.name = options.name || `formily-${this._uid}`;
    this.fields = toFields(this._schema, { form: this });
    this.models = toModels(this.fields, this);
    this.validations = this.toFormValidations(this._schema);
  }

  toFormValidations(fields) {
    return fields.reduce((acc, field) => {
      const { validations, fields } = field;
      const fieldName = camelCase(field.name);

      if (field.collection) {
        acc[fieldName] = {
          $each: this.toFormValidations(fields)
        };
      } else if (field.nested) {
        acc[fieldName] = this.toFormValidations(fields);
      } else if (validations) {
        const validators = {};

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

  mergeModels(cb) {
    const recurse = parent => {
      Object.keys(parent).forEach(key => {
        if (isPlainObject(parent)) {
          recurse(parent[key]);
        }

        cb(parent, key);
      });
    };

    recurse(this.models);
  }

  getField(path = [], fields) {
    return traverseFields(path, fields || this.fields);
  }

  getFieldSchema(path = [], fields) {
    return traverseFields(path, fields || this._schema);
  }

  getMessageFormats(fieldSchema, error, data) {
    if (!isObject(fieldSchema)) {
      fieldSchema = this.getFieldSchema(fieldSchema);
    }

    const { validations } = fieldSchema;
    const validator = validations[error.type];
    let prefix = '';
    let formats = {};

    if (!validations || !validator || !validator.messageFormats) {
      return {
        prefix,
        formats
      };
    }

    ({ prefix, ...formats } = validator.messageFormats);

    Object.keys(formats).reduce((acc, key) => {
      const formatter = formats[key];

      if (typeof formatter === 'function') {
        acc[key] = formatter.call(this, data, { error, fieldSchema });
      } else {
        acc[key] = formatter;
      }

      return acc;
    }, formats);

    return {
      prefix,
      formats
    };
  }
}
