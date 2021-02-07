import { pick } from "../utils";

const simplePlaceholderRegex = /\{([^{}]+)\}/g;

export default function stringFormatter(value: string, props: Record<string, any> = {}) {
  return value.replace(simplePlaceholderRegex, (placeholder: string, path: string) => pick(props, path) || placeholder);
}
