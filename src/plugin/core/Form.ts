import { reactor } from './observer';
import { FormGroupSchema, FormilyFieldSchema, FormilyOptions, FormSchema } from './types';
import { traverseFields } from './helpers';
import FormGroup from './FormGroup';

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
// function toModels(fields: FormilyField[]) {
//   const models = fields.reduce((acc, field) => {
//     const model = camelCase(field.formId);

//     reactor(acc, model, field, field.value);

//     return acc;
//   }, {});

//   return models;
// }

export default class Form extends FormGroup {
  readonly _schema!: FormGroupSchema;
  // validations: object;

  constructor(schema: FormSchema, options?: FormilyOptions) {
    super(schema);

    // this.validations = this.toFormValidations(this._schema.fields);
  }

  // toFormValidations(fields: FormilyFieldSchema[]) {
  //   return fields.reduce((acc: { [key: string]: any }, field) => {
  //     const { validations, fields } = field;
  //     const fieldName = camelCase(field.formId);

  //     if (field.collection) {
  //       acc[fieldName] = {
  //         $each: this.toFormValidations(fields)
  //       };
  //     } else if (field.nested) {
  //       acc[fieldName] = this.toFormValidations(fields);
  //     } else if (validations) {
  //       const validators: { [key: string]: any } = {};

  //       Object.keys(validations).forEach(key => {
  //         const validator = validations[key];

  //         if (typeof validator === 'function') {
  //           validators[key] = validator;
  //         } else {
  //           validators[key] = validator.validator;
  //         }
  //       });

  //       acc[fieldName] = validators;
  //     }

  //     return acc;
  //   }, {});
  // }

  // mergeModels(cb: (parent: any, key: string) => void) {
  //   const recurse = (parent: any) => {
  //     Object.keys(parent).forEach(key => {
  //       if (isPlainObject(parent)) {
  //         recurse(parent[key]);
  //       }

  //       cb(parent, key);
  //     });
  //   };

  //   recurse(this.models);
  // }

  getFieldSchema(path: string | string[] = [], fields?: FormilyFieldSchema[]): FormilyFieldSchema | null {
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
