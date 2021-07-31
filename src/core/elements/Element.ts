import { ElementData, ElementSchema } from './types';
import { genHtmlName, genProps, getProp } from '../../helpers/elements';
import { dumpProp, each, now, readonlyDumpProp, valueOrNull } from '../../utils';
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
  readonly model!: string;
  protected _d!: ElementData;

  props: Record<string, any>;

  shaked = false;

  abstract isValid(): boolean;

  constructor(schema: ElementSchema, parent?: Element | null) {
    super();

    const data = this._d;

    readonlyDumpProp(data, 'schema', schema);

    readonlyDumpProp(this, 'parent', valueOrNull(parent));

    dumpProp(this, 'model', schema.model || this.formId);
    dumpProp(data, 'ancestors', genElementAncestors(this));

    this.props = genProps(schema.props, this);

    each(schema.on, (handler, name) => {
      this.on(name, handler);
    });
  }

  get validation() {
    return this._d.validation;
  }

  get error() {
    if (!this.shaked || this.valid) {
      return null;
    }

    return this.validation.errors ? this.validation.errors[0] : null;
  }

  getVm() {
    return this.getProp('_formy.vm', { up: true });
  }

  getProp(path: string, options?: { up?: boolean }) {
    return getProp(this, path, options);
  }

  removeProp(key: string) {
    delete this.props[key];
  }

  addProp(key: string, value: any) {
    this.props[key] = value;
  }

  get formId(): string {
    return this._d.schema.formId || now();
  }

  get htmlName() {
    return this.getHtmlName();
  }

  get valid() {
    return this.isValid();
  }

  getHtmlName() {
    return genHtmlName(this, this._d.ancestors);
  }

  shake() {
    this.shaked = true;
  }

  cleanUp() {
    this.shaked = false;
  }
}
