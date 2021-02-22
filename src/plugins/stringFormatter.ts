import { picks } from "../utils";

const simplePlaceholderRegex = /\{([^{}]+)\}/g;

export default function stringFormatter(format: string, ...args: any[]) {
  return format.replace(simplePlaceholderRegex, (placeholder: string, path: string) => picks(path, ...args) || placeholder);
}
