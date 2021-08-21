---
title: Element
description: 'Element'
position: 21
category: Api
---

## abstract Class Element
<tree :items="[
  { text: 'Evento', url: '/api/evento' },
  { text: 'Objeto', url: '/api/objeto' },
  { text: 'Element' }
]"></tree>

Abstract class for other form elements.

**All Known Subclasses**
- [Field](/api/field)
- [Group](/api/group)
- [Collection](/api/collection)

## Constructor
```typescript
Element(schema: ElementSchema, parent?: Element | null);
```

**Parameters**
- **schema** - the schema object of this element. 
```typescript
interface ElementSchema {
  // If not provided, an id will be auto generated
  formId?: string;
  // The model name of the element,
  // used in Group as a property name in group's value,
  // if not provided. formId will be used.
  model?: string;
  // Used to generate the element properties
  props?: Record<string, any>;
  on?: Record<string, EventHandler>;
  // The options is using for this element if available.
  // With plugin, the option key is the plugin `name`,
  // e.g,
  // { 
  //    ...
  //    options: {
  //      localizer: {}
  //    }
  // }
  options?: Record<string, any>;
}
```
- **parent** - the parent of this element.

## Properties
| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| **parent** <prop-infos readonly></prop-infos> | `Element \| null` | `null` | The parent element. |
| **model** <prop-infos readonly></prop-infos> | `string` | | model name, used as a property name in `enum` type element, e.g, `{ [field1.model]: value, [field2.model]: value }` |
| **formId** <prop-infos readonly></prop-infos> | `string` | | The unique id of this element in the form |
| **htmlName** <prop-infos readonly></prop-infos> | `string` | | The global unique name of the element, which can be used as name in the html form. For radio buttons this name is not unique. |
| **valid** <prop-infos readonly></prop-infos> | `boolean` | `true` | Identifies if this element and all its children elements are valid. <alert> On first init, a form element is always `valid`. </alert> |
| **props** | `Record<string, any> \| {}` | These properties can be used to dynamically format the user interface. |
| **shaked** | `boolean`  | `false` | Indicate the field is shaked or not. |
| **error** <prop-infos readonly></prop-infos> | `string \| null`  | `null` | The error message when this element is `shaked` and `invalidated`. |
| **validation** <prop-infos readonly></prop-infos> | `Validation` | `Validation` | The [Validation](/api/validation) object. |

## Methods
### static register
This function will be called when registering the `Field` element with the `registerElement` method

**Signatures**
```typescript
register(...args: any[]);
```

**Parameters**
- **...args** - Any paramters

<alert>
  <b>vue-formily</b> will pass the <a href="/api/formily#constructor">VueFormilyOptions</a> as first argument when installing
</alert>

### static unregister
This function will be called when registering the `Field` element with the `registerElement` method

**Signatures**
```typescript
unregister(...args: any[]);
```

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
getHtmlName(): string;
```

**Returns**
- `string` - the global unique name of this element.

### getVm
Returns the current Vue instance.

**Signatures**
```typescript
getVm(): Vue;
```

**Returns**
- The Vue intance

### shake
Shake the element so that the `error message` can be shown.

**Signatures**
```typescript
shake(): void;
```

### cleanUp
Set `shaked` to `false` so that will clear the error message.

**Signatures**
```typescript
cleanUp(): void;
```

### addProps
Add new properties to the `props` property of the current element.

**Signatures**
```typescript
addProps(props: Record<string, any>, ...args: any[]): void;
```

**Parameters**
- **props** - object of `key: value` pairs, the property's value can be any [primitive types](https://developer.mozilla.org/en-US/docs/Glossary/Primitive), `object` or `array`, if value is `function`, **vue-formily** will treat it as a getter, and when it's called the first argument is always the current element.
- **...args** - any additional parametters want to pass to the property's getter

### getProps
Add new properties to `props`

**Signatures**
```typescript
getProps(path: string, options?: { up?: boolean }): any;
```

**Parameters**
- **path** - path string to get the property, e.g, `a.b` or `a[b]`
- **options**
```typescript
{
  // move up to `parent` element to get property 
  // if current element does not have one
  up?: boolean
}
```

## Inherited Methods
### From class [Evento](/api/evento)
<InheritedMethods name="evento"></InheritedMethods>

