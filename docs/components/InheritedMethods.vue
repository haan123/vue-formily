<template>
  <div class="c-inherited-methods">
    <ul class="w-full">
      <li class="c-inherited-methods__item inline-flex mr-2" v-for="(method, i) in classMethods[name]" :key="i">
        <a :href="method.url">{{ method.text }}</a>
        <template v-if="i < classMethods[name].length - 1">,</template>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    name: {
      type: String
    }
  },
  computed: {
    ...mapGetters([
      'classMethods',
    ]),
  }
}
</script>

<style lang="postcss" scoped>
.c-inherited-methods__item {
  padding:  0;

  &:before {
    display: none;
  }
}
</style>
