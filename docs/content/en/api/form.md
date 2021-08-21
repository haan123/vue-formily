---
title: Form
description: 'Form'
position: 22
category: Api
---

## Class Form
<tree :items="[
  { text: 'Evento', url: '/api/evento' },
  { text: 'Objeto', url: '/api/objeto' },
  { text: 'Element', url: '/api/element' },
  { text: 'Group', url: '/api/group' },
  { text: 'Form' }
]"></tree>

Represents a **form**. This class is just simply inherited from class [`Group`](/api/group)

## Constructor
This class inherit the constructor of the parent class.

```typescript
type FormSchema = GroupSchema;
```

## Inherited Methods
### From class [Group](/api/group)
<InheritedMethods name="group"></InheritedMethods>

### From class [Element](/api/element)
<InheritedMethods name="element"></InheritedMethods>

### From class [Evento](/api/evento)
<InheritedMethods name="evento"></InheritedMethods>

## Related concepts
- [GroupSchema](/api/group#constructor)
