const simplePlaceholderRegex = /\{([^{}]+)\}/g;

export function stringFormatter(value: string, props: Record<string, any> = {}, data: Record<string, any> = {}) {
  return value.replace(simplePlaceholderRegex, (placeholder: string, propName: string) => props[propName] || placeholder);
}
