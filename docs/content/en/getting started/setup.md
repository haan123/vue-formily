---
title: Setup
description: ''
position: 2
category: Getting started
---
Add `vue-formily` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add vue-formily
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install vue-formily
  ```

  </code-block>
</code-group>

Or you can use `vue-formily` with a script tag and a CDN, import the library like this:

```html
<script src="https://unpkg.com/vue-formily@latest"></script>
```

Then install the vue-formily via `Vue.use()`

```typescript
import Vue from 'vue';
import VueFormily from 'vue-formily';

Vue.use(VueFormily, {
  // ...options
});
```
