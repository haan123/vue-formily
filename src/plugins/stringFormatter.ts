import { picks } from "../utils";

const simplePlaceholderRegex = /\{([^{}]+)\}/g;

export default function stringFormatter(value: any, format: string, options: Record<string, any>, ...args: any[]) {
  return format.replace(simplePlaceholderRegex, (placeholder: string, path: string) => {
    return picks(path, ...args) || placeholder;
  });
}
