import { FormContainer, FormilyFieldSchema, Validation } from '.';

export declare abstract class FormElement {
  constructor(schema: any, parent?: FormContainer, index?: number);

  abstract initialize(schema: FormilyFieldSchema, parent?: FormContainer, ...args: any[]): void;
  abstract genHtmlName(path: string[], ...args: any[]): string;
  abstract isValid(): boolean;

  readonly model: string;
  /**
   * The parent within the form.
   */
  readonly parent: FormContainer | null;
  /**
   * The ID of the form element. The is is unique within the parent element of the form.
   */
  readonly formId: string;
  /**
   * The global unique name of the field, which can be used as name in the html form. For radio buttons this name is not unique.
   */
  readonly htmlName: string;
  /**
   * Identifies if this element and all its children elements are valid.
   */
  readonly valid: boolean;
  _invalidated: boolean;
  /**
   * Represents a form element validation result.
   */
  validation: Validation;
  /**
   * Global unique id of the field
   */
  readonly _uid: number;
  /**
   * This method clears the whole form. After clearing a form it contains no value or the default value, is not bound to any business object and has the status of being valid.
   */
  // clearFormElement(): void;
  /**
   * The method can be called to explicitly invalidate a form element. The error text will be set to the one of two possible preconfigured custom error messages associated with the form definition. The "value-error" message will be used for FormField instances and "form-error" will be used for FormGroup instances.
   */
  invalidate(): void;
  invalidate(error: string): void;
}
