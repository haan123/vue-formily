import { FormilyField } from '.';

export declare class FormElement {
  constructor(formId: string, parent?: FormilyField);
  /**
   * The parent within the form.
   */
  readonly parent: FormilyField | null;
  /**
   * The ID of the form element. The is is unique within the parent element of the form.
   */
  readonly formId: string;
  /**
   * The global unique name of the field, which can be used as name in the html form. For radio buttons this name is not unique.
   */
  readonly htmlName: string;
  /**
   * Use for group instance in FormGroups
   */
  readonly index?: number;
  /**
   * Global unique id of the field
   */
  readonly _uid: number;

  /**
   * This method clears the whole form. After clearing a form it contains no value or the default value, is not bound to any business object and has the status of being valid.
   */
  clearFormElement(): void;

  /**
   * The method can be called to explicitly invalidate a form element. The error text will be set to the one of two possible preconfigured custom error messages associated with the form definition. The "value-error" message will be used for FormField instances and "form-error" will be used for FormGroup instances.
   */
  invalidateFormElement(): void;
  invalidateFormElement(error: string): void;
}
