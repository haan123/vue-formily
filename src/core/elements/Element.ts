import { PropValue } from '../../types';
import { ElementData, ElementSchema } from './types';
import { genProps } from '../../helpers/elements';
import { def, each, getter, isUndefined, logMessage, toString, valueOrNull } from '../../utils';
import { Objeto } from '../Objeto';

function genElementAncestors(elem: Element): any[] | null {
  const path = [];

  let parent = elem.parent;

  while (parent) {
    path.unshift(parent);
    parent = parent.parent;
  }

  return path.length ? path : null;
}

export default abstract class Element extends Objeto {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static register() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static unregister() {}

  readonly parent!: Element | null;
  readonly formId!: string;
  readonly model!: string;
  readonly htmlName!: string;
  readonly valid!: boolean;
  readonly props: Record<string, PropValue<any>> | null;
  protected _d!: ElementData;

  shaked!: boolean;

  abstract getHtmlName(): string | null;
  abstract isValid(): boolean;

  constructor(schema: ElementSchema, parent?: Element) {
    super();

    if (!schema.formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    def(this._d, 'schema', schema);
    def(this, 'parent', valueOrNull(parent));
    getter(this, 'formId', schema.formId);
    def(this, 'model', schema.model || this.formId, { writable: true });

    this._d = {
      ancestors: genElementAncestors(this),
      invalidated: false,
      error: null,
      schema
    };

    this.props = genProps([schema.props], this);

    getter(this, 'htmlName', this.getHtmlName);
    getter(this, 'valid', this.isValid);

    each(schema.on, (handler, name) => this.on(name, handler));
  }

  shake() {
    this.shaked = true;
  }

  invalidate(error?: string) {
    this._d.invalidated = true;

    if (!isUndefined(error)) {
      this._d.error = toString(error);
    }
  }

  cleanUp() {
    this.shaked = false;
    this._d.invalidated = false;
    this._d.error = null;
  }
}
