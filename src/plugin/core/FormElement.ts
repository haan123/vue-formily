import { FormContainer, FormilyFieldSchema, Validation } from './types';
import { camelCase, def, getter, logMessage } from './utils';

let uid = 0;

export default abstract class FormElement {
  readonly parent!: FormContainer | null;
  readonly formId!: string;
  readonly model!: string;
  readonly htmlName!: string;
  readonly _uid!: number;
  valid = true;
  _invalidated = false;
  validation!: Validation;

  abstract initialize(schema: FormilyFieldSchema, ...args: any[]): void;
  abstract genHtmlName(path: string[], ...args: any[]): string;
  abstract isValid(): boolean;

  constructor(schema: any, parent?: FormContainer, ...args: any[]) {
    if (!schema.formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    def(this, 'parent', parent || null, false);
    def(this, 'formId', schema.formId, false);
    def(this, '_uid', uid++, false);
    def(this, 'model', camelCase(this.formId), false);

    this.initialize(schema, ...args);

    getter(this, 'valid', this.isValid);
    def(this, 'htmlName', this.genHtmlName([], ...args), false);
  }

  // clearFormElement() {}

  invalidate() {
    this._invalidated = true;
  }
}
