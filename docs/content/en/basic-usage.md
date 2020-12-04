---
title: Basic Usage
description: 'The fastest way to get started with **nuxt-i18n** is to define the supported `locales` list and to provide some translation messages to **vue-i18n** via the `vueI18n` option:'
position: 3
category: Guide
---

Let's start with a simple login form:

## Schema
First thing, we need a **schema** for our form:

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
<login-form></login-form>
