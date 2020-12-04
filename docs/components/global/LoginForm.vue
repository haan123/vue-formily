<template>
  <form class="login">
    <div v-for="(field, i) in forms.login.fields" :key="i" class="field">
      <label :for="field._uid">{{ field.label }}</label>
      <input v-model="field.raw" :name="field.name" :id="field._uid" />
    </div>
  </form>
</template>

<script>
import a from '../../../rules/index.ts';
import { required, email } from 'vue-formily';

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
      }
    }
  ]
};

export default {
  name: 'LoginForm',
  created() {
    this.$formily.add(loginForm);
  }
};
</script>

<style></style>
