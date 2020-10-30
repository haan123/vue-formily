import { FormSchema } from './types';
import FormGroup from './FormGroup';

export default class Form extends FormGroup {
  constructor(schema: FormSchema) {
    super(schema);
  }
}
