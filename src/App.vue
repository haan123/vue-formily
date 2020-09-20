<template>
  <div id="app"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import Formily from './plugin';

Vue.use(Formily);

export default Vue.extend({
  name: 'App',
  created() {
    this.$formily.add();
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
