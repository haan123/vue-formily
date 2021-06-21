import { def } from '@/utils';

export type EventHandler = (...args: any[]) => any;

export default class Evento {
  events: Record<string, EventHandler[]>;

  constructor() {
    this.events = {};
  }

  emit(name: string, ...args: any[]) {
    const handlers = this.events[name];

    if (handlers) {
      handlers.forEach(h => h.call(this, ...args));
    }
  }

  on(name: string, handler: EventHandler) {
    const handlers = this.events[name] || [];

    if (!handlers.includes(handler)) {
      handlers.push(handler);
    }

    def(this.events, name, handlers);
  }

  off(name: string, handler?: EventHandler) {
    const handlers = this.events[name];

    if (handler) {
      handlers.splice(handlers.indexOf(handler), 1);
    } else {
      delete this.events[name];
    }
  }
}
