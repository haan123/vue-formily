---
title: Element
description: 'Element'
position: 21
category: Api
---

## Abstract Class Element
<tree :items="[
  { text: 'Element' }
]"></tree>

Abstract class for other form elements.

**All Known Subclasses**
- [Field](/api/field)
- [Group](/api/group)
- [Collection](/api/collection)

## Constructor
```typescript
Element(schema: ElementSchema, parent?: Element | null)
```

**Parameters**
- **schema** - the schema object of this element. 
```typescript
interface ElementSchema {
  formId: string;
  // the model name of the element,
  // used in Group as a property name in group's value,
  // if not provided. formId will be used.
  model?: string;
  // used to generate the element properties
  props?: Record<string, any>;
  on?: Record<string, EventHandler>;
}
```
- **parent** - the parent of this element.

## Properties
| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| *static* **register** | `function` | | This function will be called one time |
| **parent** <prop-infos readonly></prop-infos> | `Element \| null` | `null` | The parent of this element. |
| **parent** <prop-infos readonly></prop-infos> | `Element \| null` | `null` | The parent of this element. |
| **formId** <prop-infos readonly></prop-infos> | `string` | | The unique id of this element in the form |
| **htmlName** <prop-infos readonly></prop-infos> | `string` | | The global unique name of the element, which can be used as name in the html form. For radio buttons this name is not unique. |
| **_uid** <prop-infos readonly></prop-infos> | `number` | | The global unique id of the element. |
| **valid** <prop-infos readonly></prop-infos> | `boolean` | | Identifies if this element and all its children elements are valid. <alert> On first init, a form element is always `valid`. </alert> |
| **props** <prop-infos readonly></prop-infos> | `Record<string, PropValue<any>> \| null` | `null` | These properties can be used to dynamically format the user interface. Currently, they are using for [Rule](/api/validation-rule). |

## Methods
### abstract isValid
Identifies if this element and all its children elements are valid. On first init, a form element is always `valid`.

**Signatures**
```typescript
abstract isValid(): boolean;
```

**Returns**
- `boolean` - `true` if this element and all its children elements are valid, `false` otherwise.

### abstract getHtmlName
Returns the global unique name of this element, which can be used as name in the html form. For radio buttons this name is not unique.

**Signatures**
```typescript
abstract getHtmlName(): string | null;
```

**Returns**
- `string` - the global unique name of this element.

### abstract _initialize
This abstract method will run one time when constructuring this element. The `private data` also passed in this call.

**Signatures**
```typescript
abstract _initialize(schema: ElementSchema, parent: any, data: WeakMap<Element, ElementData>, ...args: any[]): void;
```

**Parameters**
- **schema** - the schema definition of this element.
- **parent** - the parent of this element.
- **data** - the parent of this element.

**Returns**
- `string` - the global unique name of this element.

## Related concepts
- [PropValue]()
