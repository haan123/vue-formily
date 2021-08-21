<p align="center">
  <a href="#" target="_blank">
    <img width="320" src="https://raw.githubusercontent.com/haan123/vue-formily/dev/docs/static/logo-dark.svg">
  </a>
</p>
<br>

vue-formily - form manangemnet for your Vue project.

## Features

- **Flexible:** Easily handle from basic forms to nested forms, form groups...
- **Fast:** Build faster forms with schema based.
- **Lightweight:** Only handles the complicated form concerns, gives you full control over everything else
- **Progressive:** Works whether you use Vue.js as a progressive enhancement or in a complex setup
- **Built-in Rules:** Built-in Rules that covers most needs in most web applications
- **i18n:** Can be used with built-in localizer or 3rd party libraries.

## Getting Started

### Installation

```sh
# install with yarn
yarn add vue-formily

# install with npm
npm install vue-formily --save
```

### Basic Usage

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

```html
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

## Documentation

Read the [documentation and examples](https://abc.com).

## Contributing

You are welcome to contribute to this project.

## Credits

- Inspired by Salesforce CommerceCloud's [Form Elements](https://documentation.b2c.commercecloud.salesforce.com/DOC4/index.jsp?topic=%2Fcom.demandware.dochelp%2FLegacyDevDoc%2FFormDefinitionElements.html)

## License

[MIT](https://github.com/haan123/vue-formily/blob/master/LICENSE)
