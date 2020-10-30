import { FormFieldSchema, FormilyField, Validation } from './types';
import { def, isNullOrUndefined, logMessage } from './utils';

let uid = 0;

export default abstract class FormElement {
  readonly parent?: FormilyField;
  readonly index?: number;
  readonly formId!: string;
  readonly htmlName!: string;
  readonly _uid!: number;
  valid = true;
  validation!: Validation;

  abstract initialize(schema: FormFieldSchema): void;

  constructor(schema: any, parent?: FormilyField, index?: number) {
    if (!schema.formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    if (!isNullOrUndefined(index)) {
      def(this, 'index', index, false);
    }

    if (!isNullOrUndefined(parent)) {
      def(this, 'parent', parent || null, false);
    }

    def(this, 'formId', schema.formId, false);
    def(this, '_uid', uid++, false);

    this.initialize(schema);
  }

  isValid() {
    return this.valid;
  }

  // clearFormElement() {}

  invalidate() {
    this.valid = false;
  }
}
