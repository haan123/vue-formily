import { FormilyField, FormGroupSchema, FormSchema, FormilyOptions, FormGroup } from '.';

export declare class Form extends FormGroup {
  private constructor(schema: FormSchema, options?: FormilyOptions);

  readonly _schema: FormGroupSchema;
  fields: FormilyField[];
  validations: object;
}
