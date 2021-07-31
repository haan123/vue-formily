---
title: Formily
description: 'Formily'
position: 5
category: Api
---

## Class Formliy
<tree :items="[
  { text: 'Formliy' }
]"></tree>

Represents **vue-formily instance** in a Vue component.

## Constructor
```typescript
Formliy(options: VueFormilyOptions =)
```

**Parameters**
- **options** - options used for vue-formily. 

```typescript
interface VueFormilyOptions {
  rules?: ValidationRuleSchema[];
  alias?: string;
  localizer?: Localizer;
  plugins: any[];
  stringFormatter?: (format: string, data: Record<string, any>) => string;
  dateTimeFormatter?: (format: string, input: any, options?: CalendarOptions) => string;
  // all your custom form elements
  elements?: any[];
}
```

## Properties
| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| **vm** | `any` | `Vue` | the current Vue instance |
| **options** | `VueFormilyOptions` | `{ alias: 'forms' }` | options will be used for form elements |

## Methods
### addForm
Add new form to component.

<alert type="warning">
  <b>vue-formily</b> will add a <b>_formy</b> prop to the added form instance, this prop will contain some data like <b>vm (the Vue instance)</b>... so this object shouldn't be modified.
</alert>

**Signatures**
```typescript
addForm(schema: FormSchema): Form
```

**Parameters**
- **schema** - the form schema (see [FormSchema](/api/form#schema) for details).

**Returns**
- [`Form`](/api/Form) instance.

### removeForm
Remove form from component.

**Signatures**
```typescript
removeForm(formId: string)
```

**Parameters**\
- **formId** - form id want to remove.

### setInstance
Set current Vue instance.

**Signatures**
```typescript
setInstance(vm: any)
```

**Parameters**
- **vm** - current Vue instance.

## Related concepts
- [ValidationRuleSchema]()
- [Localizer]()
- [CalendarOptions]()
