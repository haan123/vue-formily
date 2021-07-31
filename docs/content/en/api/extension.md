---
title: Extension of Vue
description: 'Extension of Vue'
position: 4
category: Api
---

## Vue Injected Data
By default, once installed **vue-formily**, it will inject a `forms` object to current **Vue instance**, and will hold all the **form elements** for this instance. This `forms` alias can be customized by providing the `alias` option in the installation step (see [vue-formily options](/api/Formily#options)).

To imagine, let's see the sample below:

```typescript
// plugins/vue-formily.js
import VueFormily from 'vue-formily';

Vue.use(VueFormily, {
  // ...
});

// components/Login.vue
export default {
  created() {
    this.$formily.add({
      formId: 'login',
      // ...
    });
  },
  methods: {
    async submit() {
      await this.forms.login.validate();
    }
  }
}
```

## Vue Injected Methods

### $formily.add(schema)
Create new **form element** and injects it to `forms` object.

**Arguments:**
- schema (type: [`FieldSchemas`]())
**Return**: `Form`
- **Usage**:
asdsa
