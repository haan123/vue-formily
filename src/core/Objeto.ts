import { getter, now } from "@/utils";

export function reactiveGetter(obj: Objeto, key: string, value: any) {
  getter(obj, key, value, { configurable: true }).on('updated', function (this: Objeto) {
    const data = _storage.get(this);

    if (data.timer ) {
      clearTimeout(data.timer);
    }

    data.timer = setTimeout(() => {
      this.reactive()
    }, 10);
  }, obj);
}

const _storage = new WeakMap();

export abstract class Objeto {
  __ts: number = now();

  abstract _setup(storage: any): void;

  constructor() {
    this._setup(_storage);
  }

  reactive() {
    this.__ts = now();
  }
}
