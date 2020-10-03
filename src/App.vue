<template>
  <div id="app">
    <div v-for="(field, i) in forms.form.fields" :key="i">
      <label v-if="field.inputType === 'text'">
        {{ field.label }}
        <input type="text" />
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Formily from './plugin';
import { FormGroups, FormSchema } from './plugin/core/types';

Vue.use(Formily);

const form: FormSchema = {
  formId: 'form',
  fields: [
    {
      formId: 'a',
      label: 'a',
      type: 'string',
      inputType: 'text'
    },
    {
      formId: 'b',
      type: 'groups',
      fields: [
        {
          formId: 'c',
          type: 'string'
        },
        {
          formId: 'd',
          type: 'groups',
          fields: [
            {
              formId: 'e',
              type: 'string'
            },
            {
              formId: 'f',
              type: 'string'
            }
          ]
        }
      ]
    },
    {
      formId: 'g',
      type: 'group',
      fields: [
        {
          formId: 'h',
          type: 'string'
        }
      ]
    }
  ]
};

export default Vue.extend({
  name: 'App',
  created() {
    const f = this.$formily.add(form);
    const b = f.getField('b') as FormGroups;

    b.addGroup();

    const d = b.groups[0].getField('d') as FormGroups;

    d.addGroup();

    console.log(f);
    console.log(this.forms);
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
