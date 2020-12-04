import theme from '@nuxt/content-theme-docs';

export default theme({
  content: {
    markdown: {
      remarkExternalLinks: {
        content: {
          properties: {
            className: ['w-4', 'h-4', 'ml-1', '-mt-1', 'stroke-2']
          },
          type: 'element',
          tagName: 'icon-external-link'
        },
        contentProperties: {
          className: ['inline-block', 'align-middle', 'text-gray-600', 'dark:text-gray-400']
        }
      }
    }
  }
});
