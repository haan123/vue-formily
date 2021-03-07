import { PropValue } from '../../types';
import { ElementData, ElementSchema } from './types';
import { genProps } from '../../helpers/elements';
import { def, getter, logMessage, valueOrNull } from '../../utils';
import { Objeto } from '../Objeto';

let uid = 0;

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
  readonly parent!: Element | null;
  readonly formId!: string;
  readonly model!: string;
  readonly htmlName!: string;
  readonly _uid!: number;
  readonly valid!: boolean;
  readonly props: Record<string, PropValue<any>> | null;
  protected _d!: ElementData;

  abstract getHtmlName(): string | null;
  abstract isValid(): boolean;
  abstract invalidate(error?: string): void;

  constructor(schema: ElementSchema, parent?: Element, ...args: any[]) {
    super();

    if (!schema.formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    this._d = {
      ancestors: genElementAncestors(this),
      timer: null,
      invalidated: false
    };

    def(this, '_uid', uid++);
    def(this, 'parent', valueOrNull(parent));
    getter(this, 'formId', schema.formId);
    def(this, 'model', schema.model || this.formId, { writable: true });
    this.props = genProps([schema.props], this);

    getter(this, 'htmlName', () => this.getHtmlName());
    getter(this, 'valid', () => this.isValid());
  }

  reset() {
    const data = this._d.get(this) as ElementData;
    data.invalidated = false;
  }
}
