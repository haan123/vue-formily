
<script>
function genBadge(h, content, color) {
  return h('span', {
    staticClass: `inline-flex whitespace-no-wrap items-center px-2 leading-6 rounded-full font-semibold text-sm bg-${color}-300 dark:bg-${color}-600 text-${color}-100 mr-1 mb-1`
  }, [content])
}

export default {
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
      props.readonly && genBadge(h, 'read only', 'blue'),
      props.reactive && genBadge(h, 'reactive', 'teal')
    ]
  }
}
</script>
