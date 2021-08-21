
<script>
function genBadge(h, content, color) {
  // bg-indigo-300 dark:bg-indigo-600 text-indigo-100
  // bg-teal-300 dark:bg-teal-600 text-teal-100
  return h('span', {
    staticClass: `inline-flex whitespace-no-wrap items-center px-2 rounded-full font-semibold text-xs bg-${color}-300 dark:bg-${color}-600 text-${color}-100 mr-1 mb-1`
  }, [content])
}

export default {
  name: 'PropInfos',
  functional: true,
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    reactive: {
      type: Boolean,
      default: false
    }
  },
  render(h, { props }) {
    return [
      props.readonly && genBadge(h, 'read only', 'indigo'),
      props.reactive && genBadge(h, 'reactive', 'teal')
    ]
  }
}
</script>
