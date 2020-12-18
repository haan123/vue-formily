---
title: Element
description: 'Element'
position: 21
category: Api
---

## Class Element
<tree :items="[
  { text: 'Element' }
]"></tree>

Abstract class for other form elements

## Constructor
```typescript
Element(schema: ElementSchema, parent: any = null)
```

**Parameters**
- **schema** - an object that define the field, see [FieldSchema](/api/form-field#schema) for more details. 
- **parent** - the parent form element of this field.

## Schema
```typescript
interface ElementSchema {
  formId: PropValue<string>;
  model?: string;
  props?: Record<string, PropValue<any>>;
}
```

**Props**
- **model** - the property name when generating object from form elements. If not provided, `formId` will be used and transformed to camel case. E.g, `user_name -> userName`.
- **props** - the properties of this element, a property can has any value or `function` that return the value. See [PropValue]() for more details.

## Properties
<alert>

To reduce the burden on the **Vue reactivity system** and inscrease performance, only some picked properties can <prop-infos reactive></prop-infos>

</alert>

| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| **parent** <prop-infos readonly></prop-infos> | `Element` | `null` | the parent form element of this element. |
| **formId** <prop-infos readonly></prop-infos> | `string` | | the unique id of this element in the form |
| **htmlName** <prop-infos readonly></prop-infos> | `string` | | The global unique name of the element, which can be used as name in the html form. |
| **_uid** <prop-infos readonly></prop-infos> | `number` | | The global unique id of the element. |
| **valid** <prop-infos readonly></prop-infos> | `boolean` | | Identifies if this element and all its children elements are valid. |
| **props** <prop-infos readonly></prop-infos> | `Record<string, PropValue<any>>` | `null` | these properties can be used to dynamically format the user interface. Currently, they are using for [ValidationRule](/api/validation-rule). |

## Methods
### abstract isValid
Identifies if this element and all its children elements are valid.

**Signatures**
```typescript
abstract isValid(): boolean;
```

**Returns**
- `boolean` - `true` if this element and all its children elements are valid, `false` otherwise.

### abstract getHtmlName
Returns the global unique name of this element, which can be used as name in the html form.

**Signatures**
```typescript
abstract getHtmlName(): string | null;
```

**Returns**
- `string` - the global unique name of this element.

### abstract initialize
This abstract method will run one time when constructuring this element. The `private data` also passed in this call.

**Signatures**
```typescript
abstract initialize(schema: ElementSchema, parent: any, data: WeakMap<Element, ElementData>, ...args: any[]): void;
```

**Parameters**
- **schema** - the schema definition of this element.
- **parent** - the parent of this element.
- **data** - the parent of this element.

**Returns**
- `string` - the global unique name of this element.

## Related concepts
- [PropValue]()
