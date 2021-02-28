export type EventHandler = (...args: any[]) => any;

const _events = new WeakMap<any, Record<string, EventHandler[]>>();

export function on(context: any, name: string, handler: EventHandler) {
  const events = _events.get(context) || { [name]: []};
  const handlers = events[name];

  if (!handlers.includes(handler)) {
    handlers.push(handler);
  }

  _events.set(context, events)
}

export function off(context: any, name: string, handler?: EventHandler) {
  const events = _events.get(context);

  if (events) {
    const handlers = events[name];

    if (handler) {
      handlers.splice(handlers.indexOf(handler), 1)
    } else {
      delete events[name];
    }
  }
}

export function emit(context: any, name: string, ...args: any[]) {
  const events = _events.get(context);

  if (events) {
    const handlers = events[name];

    handlers.forEach((h) => h.call(context, ...args));
  }
}
