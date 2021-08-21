<template>
  <div class="tree">
    <div class="tree__item" :class="[`pl-${4 + i}`, `tree__item--${i}`]" v-for="(item, i) in items" :key="i">
      <a class="font-semibold" v-if="item.url" :href="item.url">{{ item.text }}</a>
      <template v-else>{{ item.text }}</template>
    </div>
  </div>
</template>

<script>
// pl-4 pl-5 pl-6 pl-7 pl-8
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="postcss" scoped>
.tree {
  position: relative;
  margin-top: 20px;
  padding-left: 5px;
}

.tree__item {
  position: relative;
  margin: 0;

  &:before {
    position: absolute;
    top: 15px;
    left: 0;
    height: 1px;
    margin: auto;
    content: '';
    @apply bg-gray-200;
  }

  &:after {
    position: absolute;
    left: 0;
    width: 1px;
    height: 100%;
    content: '';
    @apply bg-gray-200;
  }

  &:last-child:after {
    height: 15px;
  }
}

.tree__item--0:before {
  width: 10px;
}

.tree__item--1:before {
  width: 15px;
}

.tree__item--2:before {
  width: 20px;
}

.tree__item--3:before {
  width: 25px;
}

.tree__item--4:before {
  width: 30px;
}
</style>

