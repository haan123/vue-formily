import { FormSchema } from './types';

import Group from './Group';

export default class Form extends Group {
  constructor(schema: FormSchema) {
    super(schema);
  }
}
