---
title: Field
description: 'Field'
position: 22
category: Api
---

## Class Field
<tree :items="[
  { text: 'Evento', url: '/api/evento' },
  { text: 'Objeto', url: '/api/objeto' },
  { text: 'Element', url: '/api/element' },
  { text: 'Field' }
]"></tree>

Represents a **field** in a **form**.

## Constructor
```typescript
Field(schema: FieldSchema, parent?: Element | null);
```

**Parameters**
- **schema** - an object that define the element. 
```typescript
type FieldType = 'string' | 'number' | 'boolean' | 'date';
type FieldValue = string | number | boolean | Date | null;
type Format = string | ((value: FieldValue) => string)

interface FieldSchema extends ElementSchema {
  type: FieldType; // 'string' | 'number' | 'boolean' | 'date'
  inputType?: string; // Any HTML Input Type
  // The format string will be used to generate the `formatted` 
  // property in current element. Currently, only `string` and `date`
  // types are supported to use this feature.
  format?: Format;
  /**
   * The value when the field has been reset.
   * For `date` type, it's any valid date represented as a string based on the current date format.
   */
  default?: any;
  /**
   * The initial value of the field, 
   * if not provided, `default` will be used.
   * For `date` type, it's any valid date represented as a string based on the current date format.
   */
  value?: any;
  rules?: ValidationRuleSchema[];
  checkedValue?: any;
}
```
- **parent** - the parent of this element.

## Properties
| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| *static* **FORM_TYPE** | `string` | `field` | The type of the `Field`. |
| *static* **FIELD_TYPE_STRING** | `string` | `string`  | Indicates a string field in the form definition. |
| *static* **FIELD_TYPE_NUMBER** | `string` | `number`  | Indicates a number field in the form definition. |
| *static* **FIELD_TYPE_BOOLEAN** | `string` | `boolean`  | Indicates a boolean field in the form definition. |
| *static* **FIELD_TYPE_DATE** | `string` | `date`  | Indicates a date field in the form definition. |
| **formType** <prop-infos readonly></prop-infos> | `string` | `Field.FORM_TYPE` | The form type of this field. |
| **type** <prop-infos readonly></prop-infos> | `FieldType` | `string` | The type of the field.  |
| **inputType** <prop-infos readonly></prop-infos> | `string` | `text` | The [HTML Input Type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) of this field  |
| **checked** <prop-infos readonly></prop-infos> | `boolean` | `false` | Identifies if the current selected state of this field is `checked`. In case of a `boolean` field the property directly represent the boolean value. In case of a `string` or `number` field, the property is `true` if the current value matched with the value specified as `checkedValue`. In this way a selected status can be as determined for non-boolean fields.  |
| **default** <prop-infos readonly></prop-infos> | FieldValue | `null` | The value when the field has been reset..  |
| **value** | FieldValue | `null` | The **typed value** representation. The `value` is always `null` if the current element is invalid. <alert> `value` will be set **asynchronously** after validating the `raw` value </alert> |
| **formatted** <prop-infos readonly></prop-infos> | `string \| null` | `null` | The formatted value represented for the `format` option is provided in the schema. <alert> `formatted` will be set **asynchronously** after validating `raw` value </alert> |
| **raw** | `string` | `''` | The current external string representation of the value in this element. <alert> When using in Vue template, the <b>raw</b> value should be used as a HTML input's value </alert> |
| **pending** <prop-infos readonly></prop-infos> | `boolean` | `false` | Identifies if the element is processing asynchronous methods |

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
create(schema: FieldSchema, parent?: Element | null): Field;
```

**Parameters**
- **schema** - `FieldSchema` object. 
- **parent** - the parent of this element.

**Returns**
- `Field` instance

### setRaw
Set new raw value to the element asynchronously. When calling, it will call the `setValue` method automatically.

**Signatures**
```typescript
async setRaw(value: any): void;
```

**Parameters**
- **value** - The new value.

**Returns**
- the **typed value** of this element.

### setValue
Set new value to the element asynchronously. When calling, if the current value is difference from new value, this method will first `validate` the new value, if the value is `valid`, new **typed value** will be assigned to this element, otherewise the element's value is `null`. Finally, a `changed` event will be triggered.

**Signatures**
```typescript
async setValue(value: any): FieldValue;
```

**Parameters**
- **value** - The new value.

**Returns**
- the **typed value** of this element.

### setCheckedValue
Set the `checkedValue` to the element. In case of a `boolean` field the property directly represent the boolean value. In case of a `string` or `number` field, the property is `true` if the current value matched with the value specified as `checkedValue`. In this way a selected status can be as determined for non-boolean fields.

**Signatures**
```typescript
setCheckedValue(checkedValue: any): void;
```

**Parameters**
- **checkedValue** - The value want to be set to trigger the `checked = true`.

### reset
Reset the element to the default state. When calling, this method will first set the `raw` to the `default` value, clean up the validation messages, and then reset the `validation` of the element.

**Signatures**
```typescript
reset(): void;
```

### clear
This method simply cleans up all valiadtion messages, then force to set the element's value to an empty string.

**Signatures**
```typescript
clear(): void;
```

### validate
Validate the element with the current `raw` value asynchronously. Firsly, it will trigger the `validate` event, then try to cast the `raw` value to the **typed value**, this value will be sent to the `validation`, if all the validations are valid, new **typed value** will be assigned otherwise will be `null`, the new `formatted` value also be evaluated. Finally, an `validated` event will be triggered.

**Signatures**
```typescript
validate(): void;
```

## Inherited Methods
### From class [Element](/api/element)
<InheritedMethods name="element"></InheritedMethods>

### From class [Evento](/api/evento)
<InheritedMethods name="evento"></InheritedMethods>

## Related concepts
- [ValidationRuleSchema](/api/validation#constructor)
- [ElementSchema](/api/element#constructor)
