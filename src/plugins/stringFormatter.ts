import { picks } from '../utils';

const simplePlaceholderRegex = /\{([^{}]+)\}/g;

export default function stringFormatter(format: string, data: Record<string, any>) {
  return format.replace(simplePlaceholderRegex, (placeholder: string, path: string) => {
    return picks(path, data) || placeholder;
  });
}
