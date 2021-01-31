const simplePlaceholderRegex = /\{([^{}]+)\}/g;

export default function stringFormatter(value: string, props: Record<string, any> = {}) {
  return value.replace(simplePlaceholderRegex, (placeholder: string, propName: string) => props[propName] || placeholder);
}
