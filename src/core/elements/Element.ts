import { PropValue } from '../../types';
import { ElementData, ElementSchema } from './types';
import { genProps } from '../../helpers/elements';
import { camelCase, def, getter, logMessage, now, valueOrNull } from '../../utils';

let uid = 0;

const _storage = new WeakMap();

function genElementAncestors(elem: Element): any[] | null {
  const path = [];

  let parent = elem.parent;

  while (parent) {
    path.unshift(parent);
    parent = parent.parent;
  }

  return path.length ? path : null;
}


export function reactiveGetter(obj: Element, key: string, value: any) {
  getter(obj, key, value).on('updated', function (this: Element) {
    const data: ElementData = _storage.get(this);

    if (data.timer ) {
      clearTimeout(data.timer);
    }

    data.timer = setTimeout(() => {
      this.reactive()
    }, 10);
  }, obj);
}

export default abstract class Element {
  readonly parent!: Element | null;
  readonly formId!: string;
  readonly model!: string;
  readonly htmlName!: string;
  readonly _uid!: number;
  readonly valid!: boolean;
  readonly props: Record<string, PropValue<any>> | null;
  __timestamp__: number = now();

  abstract getHtmlName(): string | null;
  abstract isValid(): boolean;
  abstract initialize(schema: ElementSchema, parent: any, data: ElementData, ...args: any[]): void;
  abstract invalidate(error?: string): void;

  constructor(schema: ElementSchema, parent?: Element, ...args: any[]) {
    if (!schema.formId) {
      throw new Error(logMessage('"formId" can not be null or undefined'));
    }

    def(this, '_uid', uid++, { writable: false });
    def(this, 'parent', valueOrNull(parent), { writable: false });
    getter(this, 'formId', schema.formId, { reactive: false });
    def(this, 'model', schema.model || camelCase(this.formId));
    this.props = genProps([schema.props], this);

    const data = {
      ancestors: genElementAncestors(this),
      timer: null
    };

    _storage.set(this, data);

    this.initialize(schema, parent, data, ...args);

    getter(this, 'htmlName', () => this.getHtmlName());
    getter(this, 'valid', () => this.isValid());
  }

  reset() {
    const data = _storage.get(this);
    data.invalidated = false;
  }

  reactive() {
    this.__timestamp__ = now();
  }
}
