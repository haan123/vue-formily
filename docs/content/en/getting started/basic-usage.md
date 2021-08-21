---
title: Basic Usage
description: ''
position: 3
category: Getting started
---

Let's start with a simple login form:

## Schema
`vue-formily` need a form schema to work with, so let's define one:

```js
const loginForm = {
  formId: 'login',
  formType: 'group',
  fields: [
    {
      formId: 'email',
      formType: 'field',
      label: 'Email',
      type: 'string',
      inputType: 'email',
      rules: {
        required,
        email
      }
    },
    {
      formId: 'password',
      formType: 'field',
      label: 'Password',
      type: 'string',
      inputType: 'password',
      rules: {
        required
      },
    }
  ]
}
```

## Instantiation
Then we call [`$formily.add`](/api/extension#formilyaddschema) to create new form element and injects it to Vue instance's `forms` object.

```vue
<template>
  <form class="login">
    <div v-for="(field, i) in forms.login.fields" :key="i" class="field">
      <label :for="field._uid">{{ field.label }}</label>
      <input v-model="field.raw" :name="field.name" :id="field._uid" />
    </div>
  </form>
</template>

<script>
export default {
  created() {
    // Create new form element and injects it to `forms` object.
    this.$formily.add(loginForm);
  }
}
</script>
```

**Result**
<code-sandbox id="formily-basic-usage-ccf4x"></code-sandbox>
