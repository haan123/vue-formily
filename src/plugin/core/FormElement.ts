import { genHtmlName } from './helpers';
import { FormilyField, Validations } from './types';
import { def, logMessage } from './utils';

let uid = 0;

export default class FormElement {
  readonly parent!: FormilyField | null;
  readonly formId!: string;
  readonly htmlName!: string;
  readonly index?: number;
  readonly _uid!: number;
  valid = true;
  validations!: Validations;

  constructor(formId: string, parent?: FormilyField, index?: number) {
    if (!formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    if (typeof index !== 'undefined') {
      def(this, 'index', index, false);
    }

    def(this, 'parent', parent || null, false);
    def(this, 'formId', formId, false);
    def(this, 'htmlName', genHtmlName(this), false);
    def(this, '_uid', uid++, false);
    def(this, 'validations', {});
  }

  isValid() {
    return this.valid;
  }

  // clearFormElement() {}

  invalidate() {
    this.valid = false;
  }
}
