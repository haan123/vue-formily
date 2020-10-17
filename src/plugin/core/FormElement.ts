import { genHtmlName } from './helpers';
import { FormilyField, Validations } from './types';
import { def, vfMessage } from './utils';

let uid = 0;

export default class FormElement {
  /**
   * The parent within the form.
   */
  readonly parent!: FormilyField | null;
  /**
   * The ID of the form element. The is is unique within the parent element of the form.
   */
  readonly formId!: string;
  /**
   * The global unique name of the field, which can be used as name in the html form. For radio buttons this name is not unique.
   */
  readonly htmlName!: string;
  /**
   * Use for group instance in FormGroups
   */
  readonly index?: number;
  /**
   * Identifies if this element and all its children elements are valid.
   */
  valid = true;
  /**
   * Represents a form element validation result.
   */
  validations!: Validations;
  /**
   * Use for group instance in FormGroups
   */
  readonly _uid!: number;

  constructor(formId: string, parent?: FormilyField, index?: number) {
    if (!formId) {
      throw new Error(vfMessage('Missing "formId", please provide a "formId" property for your schema'));
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

  /**
   * Identifies if this element and all its children elements are valid. A form element is always valid on first initialization
   */
  isValid() {
    return this.valid;
  }

  /**
   * This method clears the whole form. After clearing a form it contains no value or the default value, is not bound to any business object and has the status of being valid.
   */
  clearFormElement() {}

  /**
   * The method can be called to explicitly invalidate a form element. The error text will be set to the one of two possible preconfigured custom error messages associated with the form definition. The "value-error" message will be used for FormField instances and "form-error" will be used for FormGroup instances.
   */
  invalidate() {
    this.valid = false;
  }
}
