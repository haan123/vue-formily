<template>
  <div id="app">
    <div v-for="(field, i) in forms.form.fields" :key="i">
      <label v-if="field.inputType === 'text'">
        {{ field.label }}
        <input type="text" v-model="field.raw" @input="fieldInput($event, field)" />
      </label>
      <div v-if="field.formId === 'g'">
        <div v-for="(field, ii) in field.fields" :key="ii">
          <label v-if="field.inputType === 'text'">
            {{ field.label }}
            <input type="text" v-model="field.raw" @input="fieldInput($event, field)" :placeholder="field.formId" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import VueI18n from 'vue-i18n';

import Formily from './plugin';
import { FormField, FormGroups, FormSchema } from './plugin/core/types';
import { maxLength, minLength, required } from './plugin/core/rules';

// Vue.use(VueI18n);

Vue.use(Formily, {
  test: 'a'
});

const form: FormSchema = {
  formId: 'form',
  fields: [
    {
      formId: 'a',
      label: 'a',
      type: 'string',
      inputType: 'text',
      default: '11222',
      rules: {
        required,
        minLength: {
          ...minLength,
          message: 'aaas'
        },
        maxLength: {
          ...maxLength,
          message() {
            return '';
          }
        }
      },
      props: {
        minLength: 3,
        maxLength(value) {
          return value.length + 10;
        }
      }
    },
    {
      formId: 'b',
      rules: {
        required
      },
      group: {
        fields: [
          {
            formId: 'c',
            type: 'string'
          },
          {
            formId: 'd',
            group: {
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
          }
        ]
      }
    },
    {
      formId: 'g',
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

    console.log('add group');

    b.addGroup();

    const d = b.groups[0].getField('d') as FormGroups;

    d.addGroup();

    console.log(f);
  },
  methods: {
    fieldInput(e: any, field: FormField) {
      console.log(field);
    }
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
