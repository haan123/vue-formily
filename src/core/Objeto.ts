import Evento from './Evento';

export abstract class Objeto extends Evento {
  protected _d: any;

  constructor() {
    super();

    this._d = {};
  }
}
