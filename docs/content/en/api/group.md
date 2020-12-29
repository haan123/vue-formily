---
title: Group
description: 'Group'
position: 23
category: Api
---

## Class Group
<tree :items="[
  { text: 'Element', url: '/api/form-element' },
  { text: 'Group' }
]"></tree>

The class is the **central class** within the whole form handling. It is the container element for **fields** and other **form elements**.

**All Known Subclasses**
- [Form](/api/form)

## Constructor
```typescript
Group(schema: GroupSchema, parent: Element | null = null)
```

**Parameters**
- **schema** - an object that define the field, see [GroupSchema](/api/group#schema) for more details. 
- **parent** - the parent of this field.

## Schema
```typescript
type FieldSchemas = FieldSchema | GroupSchema | CollectionSchema;

interface GroupSchema extends ElementSchema {
  formType: 'group';
  fields: FieldSchemas[]; // Accepts all `vue-formily` fields
  /**
   * Object with `key` is rule's name,
   * `value` is the schema of the rule
  */
  rules?: Record<string, ValidationRuleSchema>;
}
```

## Properties
<alert>

To reduce the burden on the **Vue reactivity system** and inscrease performance, only some picked properties can <prop-infos reactive></prop-infos>

</alert>

| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| *static* **FORM_TYPE** | `string` | `group` | the type of the `Group` |
| **formType** <prop-infos readonly></prop-infos> | `group` | `group` | the form type of this field |
| **type** <prop-infos readonly></prop-infos> | `enum` | `enum` | the type of this field |
| **validation** <prop-infos readonly></prop-infos> | [`Validation`](/api/validation) | `{ rules: null, errors: null, valid: true }` | contains `rules` of this field, the `errors` messages of all **failed rules**, the `valid` identifies if this field and all its children fields are valid.  |

## Methods
### static create
This method helps to create new `Group` dynamically. A real usage can be found [here]()

**Signatures**
```typescript
create(schema: GroupSchema, parent: Element | null = null): Group
```

**Parameters**
- **schema** - an **object** that define the **field**, see [GroupSchema](/api/form-field#schema) for more details. 
- **parent** - the parent of this field.

**Returns**
- `Group` instance

### static accept
This method will **validate** the **input schema**. It should be called before  the `Group` instantiation.

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
async validate(val: any): Promise<ValidationResult>
```

**Parameters**
- **val** - any value want to be validated

**Returns**
- Object contains `errors` and typed `value`. See [`ValidationResult`]() for more details.

### getField
Get single field

**Signatures**
```typescript
getField(path: string | string[] = []): Element | null
```

**Parameters**
- **path** - if `path` is `string`, so nested fields will be separated by `.` - e.g, `form.user.name`.

**Returns**
- The found field, or `null` if not found

## Related concepts
- [Element](/api/element)
- [FieldSchema](/api/field#schema)
- [CollectionSchema](/api/collection#schema)
