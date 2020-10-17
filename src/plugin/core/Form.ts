import { FormGroupSchema, FormilyFieldSchema, FormilyOptions, FormSchema } from './types';
import { traverseFields } from './helpers';
import FormGroup from './FormGroup';

export default class Form extends FormGroup {
  readonly _schema!: FormGroupSchema;

  constructor(schema: FormSchema, options?: FormilyOptions) {
    super(schema);

    // this.validations = this.toFormValidations(this._schema.fields);
  }

  getFieldSchema(path: string | string[] = [], fields?: FormilyFieldSchema[]): FormilyFieldSchema | null {
    return traverseFields(path, fields || this._schema);
  }
}
