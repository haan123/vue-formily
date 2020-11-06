import { FormContainer, FormilyFieldSchema, Validation } from './types';
import { camelCase, def, getter, logMessage } from './utils';

let uid = 0;

export default abstract class FormElement {
  readonly parent!: FormContainer | null;
  readonly formId!: string;
  readonly model!: string;
  readonly htmlName!: string;
  readonly _uid!: number;
  readonly valid!: boolean;
  validation!: Validation;
  _invalidated = false;

  abstract initialize(schema: FormilyFieldSchema, ...args: any[]): void;
  abstract genHtmlName(path: string[], ...args: any[]): string;
  abstract isValid(): boolean;

  constructor(schema: FormilyFieldSchema, parent?: FormContainer, ...args: any[]) {
    if (!schema.formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    def(this, '_uid', uid++, { writable: false });
    def(this, 'parent', parent || null, { writable: false });
    def(this, 'formId', schema.formId, { writable: false });
    def(this, 'model', schema.model || camelCase(this.formId));

    this.initialize(schema, ...args);

    def(this, 'htmlName', this.genHtmlName([], ...args), { writable: false });

    getter(this, 'valid', () => (this._invalidated ? false : this.isValid()));
  }

  // clearFormElement() {}

  invalidate() {
    this._invalidated = true;
  }
}
