---
title: Group
description: 'Group'
position: 23
category: Api
---

## Class Group
<tree :items="[
  { text: 'Evento', url: '/api/evento' },
  { text: 'Objeto', url: '/api/objeto' },
  { text: 'Element', url: '/api/form-element' },
  { text: 'Group' }
]"></tree>

The **central class** within the whole form handling. It is the container element for **fields** and other **form elements**. Access to the elements of a form is provided via an index based access or via an associative array access. E.g, the field `firstname` can be accessed with the expression `myform.firstname`.

**All Known Subclasses**
- [Form](/api/form)
- [CollectionItem](/api/collection-item)

## Constructor
```typescript
constructor(schema: GroupSchema, parent?: Element | null);
```

**Parameters**
- **schema** - an object that define the element.
```typescript
interface GroupSchema extends ElementSchema {
  // A group is like an object so it needs some fields.
  // vue-formily has 3 built-in field element types as below.
  fields: (FieldSchema | GroupSchema | CollectionSchema)[];
  rules?: ValidationRuleSchema[];
}
```
- **parent** - the parent of this element.

## Properties

| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| *static* **FORM_TYPE** | `string` | `group` | the type of the `Group` |
| **formType** <prop-infos readonly></prop-infos> | `string` | `Group.FORM_TYPE` | the form type of this field |
| **type** <prop-infos readonly></prop-infos> | `enum` | `enum` | the type of this field |
| **pending** <prop-infos readonly></prop-infos> | `boolean` | `false` | Identifies if the element is processing asynchronous methods |
| **value** | `Record<string, any> \| null` | `null` | The **typed group value** representation. E.g, `{ name: 'Jonh', age: 23 }`. The `value` is always `null` if the current group element or any of its children element is invalid. <alert> When there are sub elements were changed and validated, the new value for that element will be mapped to the current group's value, then the group will be validated again. All processes will be asynchronously. </alert> |

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
create(schema: GroupSchema, parent?: Element | null): Field;
```

**Parameters**
- **schema** - `GroupSchema` object. 
- **parent** - the parent of this element.

**Returns**
- `Group` instance

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
Set new value to all the sub elements **asynchronously**. When calling, it will loop through the properties of the inputing object, then calling the `setValue` to **each element**, when new value is set to an element, this value also **mapped up** to the group's value. Finally, a `changed` event will be triggered for current group element.

**Signatures**
```typescript
async setValue(obj: Record<string, any>): Record<string, any> | null;
```

**Parameters**
- **obj** - The object with new values. Note that the object's properties have to be mapped with the `model` fields of the sub elements.

**Returns**
- the **typed value** or `null`.

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
