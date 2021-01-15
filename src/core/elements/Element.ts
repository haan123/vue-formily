import { PropValue } from '../../types';
import { ElementData, ElementSchema } from './types';
import { genProps } from '../../helpers/elements';
import { camelCase, def, getter, logMessage, valueOrNull } from '../../utils';
import { Objeto, reactiveGetter } from '../Objeto';

let uid = 0;
let _storage: WeakMap<Element, ElementData>;

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

  abstract getHtmlName(): string | null;
  abstract isValid(): boolean;
  abstract initialize(schema: ElementSchema, parent: any, data: ElementData, ...args: any[]): void;
  abstract invalidate(error?: string): void;

  constructor(schema: ElementSchema, parent?: Element, ...args: any[]) {
    super();

    if (!schema.formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    def(this, '_uid', uid++, { writable: false });
    def(this, 'parent', valueOrNull(parent), { writable: false });
    def(this, 'model', schema.model || camelCase(this.formId));
    getter(this, 'formId', schema.formId);
    this.props = genProps([schema.props], this);

    this.initialize(schema, parent, _storage.get(this) as ElementData, ...args);

    reactiveGetter(this, 'htmlName', () => this.getHtmlName());
    reactiveGetter(this, 'valid', () => this.isValid());
  }

  initData(storage: any) {
    _storage = storage;
    _storage.set(this, {
      ancestors: genElementAncestors(this),
      timer: null,
      invalidated: false
    });
  }

  reset() {
    const data = _storage.get(this) as ElementData;
    data.invalidated = false;
  }
}
