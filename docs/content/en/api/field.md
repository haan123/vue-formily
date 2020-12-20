---
title: Field
description: 'Field'
position: 22
category: Api
---

## Class Field
<tree :items="[
  { text: 'Element', url: '/api/form-element' },
  { text: 'Field' }
]"></tree>

Represents a **field** in a **form**.

## Constructor
```typescript
Field(schema: FieldSchema, parent: Element | null = null)
```

**Parameters**
- **schema** - an object that define the field. See [FieldSchema](/api/form-field#schema) for more details. 
- **parent** - the parent of this field.

## Schema
```typescript
interface FieldSchema extends ElementSchema {
  formType: 'field';
  type: FieldType; // 'string' | 'number' | 'boolean' | 'date'
  inputType?: string; // Any HTML Input Type
  format?: Formatter;
  /**
   * The value when the field has been reset
   */
  default?: FieldValue;
  /**
   * The initial value of the field, 
   * if not provided, `default` will be used
   */
  value?: FieldValue;
  rules?: Record<string, ValidationRuleSchema>;
}
```

## Properties
<alert>

To reduce the burden on the **Vue reactivity system** and inscrease performance, only some picked properties can <prop-infos reactive></prop-infos>

</alert>

| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| static **FORM_TYPE** | `string` | `field` | The type of the `Field`. |
| static **FIELD_TYPE_STRING** | `string` | `string`  | indicates a string field in the form definition. |
| static **FIELD_TYPE_NUMBER** | `string` | `number`  | indicates a number field in the form definition. |
| static **FIELD_TYPE_BOOLEAN** | `string` | `boolean`  | indicates a boolean field in the form definition. |
| static **FIELD_TYPE_DATE** | `string` | `date`  | indicates a date field in the form definition |
| **formType** <prop-infos readonly></prop-infos> | `string` | `field` | The form type of this field. |
| **type** <prop-infos readonly></prop-infos> | [`FieldType`]() | `string` | The type of the field, the type is one of the `FIELD_TYPE` constants defined in this class  |
| **inputType** <prop-infos readonly></prop-infos> | `string` | `text` | The [HTML Input Type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) of this field  |
| **default** <prop-infos readonly></prop-infos> | [`FieldValue`]() | `null` | The default typed value representation, which can be a `string`, `number`, `boolean` or `Date` or `null`.  |
| **value** <prop-infos reactive></prop-infos> | [`FieldValue`]() | `null` | The typed value representation, which can be a `string`, `number`, `boolean`, `Date` or `null`. <alert> `value` will be set **asynchronously** after validating `raw` value </alert> |
| **formatted** <prop-infos readonly reactive></prop-infos> | `string` | `null` | the formatted value generated from [`Formatter`]() in [`FieldSchema`](). <alert> `formatted` will be set **asynchronously** after validating `raw` value </alert> |
| **raw** <prop-infos reactive></prop-infos> | `string` | '' | the current external string representation of the value in this field. |
| **validation** <prop-infos readonly></prop-infos> | [`Validation`](/api/validation) | '' | the [Validation](/api/validation) of this field. |

## Methods
### static create
This method helps to create new `Field` dynamically. A real usage can be found [here]()

**Signatures**
```typescript
create(schema: FieldSchema, parent: Element | null = null): Field
```

**Parameters**
- **schema** - an **object** that define the **field**. See [FieldSchema](/api/form-field#schema) for more details. 
- **parent** - the parent of this field.

**Returns**
- `Field` instance

### static accept
This method will **validate** the **input schema**. It should be called before  the `Field` instantiation.

**Signatures**
```typescript
accept(schema: any): SchemaValidation
```

**Parameters**
- **schema** - the validating schema.

**Returns**
- [`SchemaValidation`]()

### validate
`async` method to identifies if this field is `valid`.

**Signatures**
```typescript
type FieldValidationResult = ValidationResult & {
  value: FieldValue;
};

async validate(val: any): Promise<FieldValidationResult>
```

**Parameters**
- **val** - any value want to be validated

**Returns**
- Object contains `errors` and typed `value`. See [`FieldValidationResult`]() for more details.

## Related concepts
- [ValidationResult]()
- [ElementSchema](/api/element#schema)
- [FieldType]()
- [Formatter]()
- [FieldValue]()
- [ValidationRuleSchema]()
