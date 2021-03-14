import Events from './Events';

export abstract class Objeto extends Events {
  protected _d: any;

  constructor() {
    super();

    this._d = {}
  }
}
