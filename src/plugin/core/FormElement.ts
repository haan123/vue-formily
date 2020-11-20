import { FormContainer, FormElementData, FormilyElements, FormilySchemas, Validation } from './types';
import { camelCase, def, getter, logMessage } from './utils';

let uid = 0;

const _privateData = new WeakMap();

function genFormElementAncestors(formElement: any): FormilyElements[] | null {
  const path = [];

  let parent = formElement.parent;

  while (parent) {
    path.unshift(parent);
    parent = parent.parent;
  }

  return path.length ? path : null;
}

export default abstract class FormElement {
  readonly parent!: FormContainer | null;
  readonly formId!: string;
  readonly model!: string;
  readonly htmlName!: string;
  readonly _uid!: number;
  readonly valid!: boolean;
  validation!: Validation;

  abstract getHtmlName(): string | null;
  abstract isValid(): boolean;
  abstract initialize(
    schema: FormilySchemas,
    parent: FormContainer | null,
    data: FormElementData,
    ...args: any[]
  ): void;

  constructor(schema: FormilySchemas, parent: FormContainer | null = null, ...args: any[]) {
    if (!schema.formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    def(this, '_uid', uid++, { writable: false });
    def(this, 'parent', parent, { writable: false });
    def(this, 'formId', schema.formId, { writable: false });
    def(this, 'model', schema.model || camelCase(this.formId));

    const data = {
      ancestors: genFormElementAncestors(this),
      invalidated: false
    };

    _privateData.set(this, data);

    this.initialize(schema, parent, data, ...args);

    getter(this, 'htmlName', () => this.getHtmlName());
    getter(this, 'valid', () => this.isValid());
  }

  invalidated() {
    const data = _privateData.get(this);
    return data.invalidated;
  }

  // clearFormElement() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  invalidate(error?: string) {
    const data = _privateData.get(this);
    data.invalidated = true;
  }
}
