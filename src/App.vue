<template>
  <div id="app"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import Formily from './plugin';
import { VFFieldSchema } from './plugin/core/types';

Vue.use(Formily);

const form: VFFieldSchema[] = [
  {
    name: 'n1',
    type: 'string'
  },
  {
    name: 'n2',
    type: 'number'
  },
  {
    name: 'n3',
    type: 'boolean'
  },
  {
    name: 'n4',
    type: 'date'
  },
  {
    name: 'n5',
    type: 'number',
    validations: {
      $each: {}
    }
  },
  {
    name: 'c1',
    type: 'collection',
    fields: [
      {
        name: 'c11',
        type: 'string'
      },
      {
        name: 'c1',
        type: 'collection',
        fields: [
          {
            name: 'c21',
            type: 'string'
          },
          {
            name: 'c22',
            type: 'number'
          }
        ]
      }
    ]
  }
];

export default Vue.extend({
  name: 'App',
  created() {
    const f = this.$formily.add(form);

    console.log(f);
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
