---
title: Evento
description: 'Evento'
position: 21
category: Api
---

## Class Evento
<tree :items="[
  { text: 'Evento' }
]"></tree>

Event utility class.

**All Known Subclasses**
- [Objeto](/api/objeto)

## Constructor
```typescript
Evento();
```

## Properties
| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| **events** | `Record<string, EventElement>` | `{}` | An object that contains all events for current instance. |

```typescript
type EventHandler = (...args: any[]) => any;
type EventOptions = {
  // Make the event can not be off with the `off` method
  noOff?: boolean;
};
type EventElement = {
  handlers: EventHandler[];
  options?: EventOptions;
};
```

## Methods
### emit
Trigger the registered event.

**Signatures**
```typescript
emit(name: string, ...args: any[]): Evento;
```

**Parameters**
- **name** - The event name. It can be namespaced by adding the colon after event name like this `click:namespace`, then you can remove or trigger all the events that only belong to this namespace.
- **...args** - All checked datas.

**Returns**
- `Evento` instance

### once
Register a one time call event handler.

**Signatures**
```typescript
once(name: string, handler: EventHandler): Evento;
```

**Parameters**
- **name** - The event name. It can be namespaced by adding the colon after event name like this `click:namespace`, then you can remove or trigger all the events that only belong to this namespace.
- **handler** - The event handler function.

**Returns**
- `Evento` instance

### on
Register a event handler.

**Signatures**
```typescript
on(name: string, handler: EventHandler, options?: EventOptions): Evento;
```

**Parameters**
- **name** - The event name. It can be namespaced by adding the colon after event name like this `click:namespace`, then you can remove or trigger all the events that only belong to this namespace.
- **handler** - The event handler function.
- **options** - The event handler function.

```typescript
type EventOptions = {
  // Make the event can not be off with the `off` method
  noOff?: boolean;
};
```

**Returns**
- `Evento` instance

### off
Register a event handler.

**Signatures**
```typescript
off(name: string, handler?: EventHandler): Evento;
```

**Parameters**
- **name** - The event name. It can be namespaced by adding the colon after event name like this `click:namespace`, then you can remove or trigger all the events that only belong to this namespace.
- **handler** - The event handler function.

**Returns**
- `Evento` instance


