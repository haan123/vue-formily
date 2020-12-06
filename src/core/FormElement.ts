import { PropValue, ValidationRuleSchema } from '../types';
import { camelCase, def, getter, logMessage } from '../utils';

export interface FormElementData {
  ancestors: any[] | null;
  invalidated: boolean;
}

export interface FormElementSchema {
  readonly formId: PropValue<string>;
  rules?: Record<string, ValidationRuleSchema>;
  model?: string;
}

let uid = 0;

const _privateData = new WeakMap();

function genFormElementAncestors(formElement: FormElement): any[] | null {
  const path = [];

  let parent = formElement.parent;

  while (parent) {
    path.unshift(parent);
    parent = parent.parent;
  }

  return path.length ? path : null;
}

export default abstract class FormElement {
  readonly parent!: FormElement;
  readonly formId!: string;
  readonly model!: string;
  readonly htmlName!: string;
  readonly _uid!: number;
  readonly valid!: boolean;

  abstract getHtmlName(): string | null;
  abstract isValid(): boolean;
  abstract initialize(schema: FormElementSchema, parent: any, data: FormElementData, ...args: any[]): void;

  constructor(schema: FormElementSchema, parent: any = null, ...args: any[]) {
    if (!schema.formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    def(this, '_uid', uid++, { writable: false });
    def(this, 'parent', parent, { writable: false });
    getter(this, 'formId', schema.formId, { reactive: false });
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
