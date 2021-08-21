---
title: Collection
description: 'Collection'
position: 24
category: Api
---

## Class Collection
<tree :items="[
  { text: 'Evento', url: '/api/evento' },
  { text: 'Objeto', url: '/api/objeto' },
  { text: 'Element', url: '/api/element' },
  { text: 'Collection' }
]"></tree>

The container that contains one or more **group of forms** (or list of forms).

## Constructor
```typescript
Collection(schema: CollectionSchema, parent?: Element | null);
```

**Parameters**
- **schema** - an object that define the element.
```typescript
interface CollectionSchema extends ElementSchema {
  // A collection will contain multiple groups,
  // so we need a group schema here.
  // Note that this group schema doesn't need a `formId` ,
  // it will be generated dynamically when adding new group.
  group: Omit<GroupSchema, 'formId'>;
  rules?: ValidationRuleSchema[];
}
```
- **parent** - the parent of this element.

## Properties
| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| *static* **FORM_TYPE** | `string` | `collection` | the type of the `Collection` |
| **formType** <prop-infos readonly></prop-infos> | `string` | `Collection.FORM_TYPE` | the form type of this field |
| **type** <prop-infos readonly></prop-infos> | `set` | `set` | the type of this field |
| **pending** <prop-infos readonly></prop-infos> | `boolean` | `false` | Identifies if the element is processing asynchronous methods |
| **value** | `any[] \| null` | `null` | The **array of typed group value** representation. E.g, `[{ name: 'Jonh', age: 23 }, { name: 'Smith', age: 22 }]`. The `value` is always `null` if the current collection element or any of its children element is invalid. |

## Methods
### static accept
Internal function to validate the input schema, called when generating the element.

**Signatures**
```typescript
accept(schema: any): SchemaValidation;

type SchemaValidation = {
  valid: boolean;
  reason?: string;
  infos?: Record<string, string>;
};
```

**Parameters**
- **schema** - schema object.

### static create
This method helps to create new `Field` dynamically.

**Signatures**
```typescript
create(schema: CollectionSchema, parent?: Element | null): Field;
```

**Parameters**
- **schema** - `CollectionSchema` object. 
- **parent** - the parent of this element.

**Returns**
- `Collection` instance

### validate
Validate the element with the current `value` asynchronously. Firsly, it will trigger the `validate` event, then trying to validate all the sub elements (if `cascade = true`) and current group element. If all validations are valid, new value will be set otherwise will be `null`. Finally, an `validated` event will be triggered.

**Signatures**
```typescript
validate(options?: { cascade?: boolean }): void;
```

**Parameters**
- **options** - The validation options.
```typescript
{
  // If `true`, all sub elements will be validated
  cascade?: boolean
}
```

### setValue
Set new value to all the sub elements **asynchronously**. When calling, it will loop through the items of the inputing array, then calling the `setValue` to **each group element**, when new value is set to a group element, the value of the current collection is also updated. Finally, a `changed` event will be triggered for current group element.

**Signatures**
```typescript
async setValue(value: any[], options?: { from?: number; autoAdd?: boolean }): any[] | null;
```

**Parameters**
- **value** - The array with new values. Note that the object's properties in each array item have to be mapped with the `model` fields of the sub group elements.
- **options** - The options object.
```typescript
{
  // The index want to set value from, default is `0`
  from?: number;
  // If `true` and the checked array has more items then the current
  // collection's value, then new group will be added automatically.
  autoAdd?: boolean;
}
```

**Returns**
- the **typed value** or `null`.

### addGroup
Add new group and if the value of the added group is `valid`, then the collection's value is also updated with that group's value.

**Signatures**
```typescript
addGroup(): CollectionItem;
```

**Returns**
- the **CollectionItem** instance.

### removeGroup
Remove group from the current collection. When calling, it will remove the group, update the collection's value, then `validate` the collection. Finally, a `changed` event will be triggered.

**Signatures**
```typescript
removeGroup(itemOrIndex: CollectionItem | number): void;
```

**Parameters**
- **itemOrIndex** - The index number of the group item or the `CollectionItem` instance

### clear
This method simply cleans up all valiadtion messages, and also `clear` all the sub elements.

**Signatures**
```typescript
clear(): void;
```

### reset
Reset the element and all sub elements to the default state, clean up the validation messages, and then reset the `validation` of the element.

**Signatures**
```typescript
reset(): void;
```

### shake
Shake the element and all the sub elements (if `cascade === true`) so that the `error message` can be shown.

**Signatures**
```typescript
shake(options?: { cascade?: boolean }): void;
```

**Parameters**
- **options** - The validation options.
```typescript
{
  // If `true`, all sub elements will be validated
  cascade?: boolean
}
```

## Inherited Methods
### From class [Element](/api/element)
<InheritedMethods name="element"></InheritedMethods>

### From class [Evento](/api/evento)
<InheritedMethods name="evento"></InheritedMethods>

## Related concepts
- [ValidationRuleSchema](/api/validation#constructor)
- [ElementSchema](/api/element#constructor)
- [FieldSchema](/api/field#constructor)
- [CollectionSchema](/api/collection#constructor)
- [CollectionItem](/api/collection-item)
