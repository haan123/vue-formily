---
title: Rule
description: 'Rule'
position: 21
category: Api
---

## Class Rule
<tree :items="[
  { text: 'Evento', url: '/api/evento' },
  { text: 'Objeto', url: '/api/objeto' },
  { text: 'Rule' }
]"></tree>

Validation rule class.

## Constructor
```typescript
Rule(rule: Rule | RuleSchema | Validator);
```

**Parameters**
- **rule** - The schema object or Rule instance or just a validator function. 
```typescript
type Validator = (value: any, props: any, ...args: any[]) => string | boolean | Promise<string | boolean>;

interface RuleSchema {
  validator?: Validator;
  name?: string;
  // The error message when the rule is invalid
  message?: string;
}
```

## Properties
| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| **name** <prop-infos readonly></prop-infos> | `string` | | The rule's name |
| **message** | `string \| null` | `null` | The message to be shown as `error` message. If [I18 plugin](/api/i18) was plugged, this message will be localized. |
| **validator** | `Validator \| null` | `null` | The validator for current rule. |
| **valid** | `boolean` | `true` | Indicate current rule is valid or not. |
| **error** | `string \| null` | `null` | The localized error message. |

## Methods
### setMessage
Set rule message.

**Signatures**
```typescript
setMessage(message?: string): void;
```

**Parameters**
- **message** - The message.

### reset
Reset the current rule to the default state:
- `error = null`
- `valid = true`

**Signatures**
```typescript
reset(): void;
```

### validate
Validate curernt rule asynchronously. When calling, it will first trigger the `validate` event, then do the valiadtion. Finally, emit a `validated` event.

**Signatures**
```typescript
async validate(value: any, ...args: any[]): Promise<Rule>;
```

**Parameters**
- **value** - Any value to validate.
- **...args** - The rest of the parameters want to pass along to the **validator**.

<alert>
<b>vue-formily</b> will pass the current element's props to the <b><i>props parameter</i></b> and the current element instance to the <b><i>4th paramter</i></b>.
</alert>

**Returns**
- The `Rule` instance in `Promise`.

## Inherited Methods
### From class [Evento](/api/evento)
<InheritedMethods name="evento"></InheritedMethods>
