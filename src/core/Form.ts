import FormGroup, { FormGroupSchema } from './FormGroup';

export default class Form extends FormGroup {
  constructor(schema: FormGroupSchema) {
    super(schema);
  }
}
