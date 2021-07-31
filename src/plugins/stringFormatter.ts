import { VueFormilyPlugin } from '../types';
import { STRING_FORMATTER } from '../constants';
import { picks, toString } from '../utils';

const simplePlaceholderRegex = /\{([^{}]+)\}/g;

export function stringFormatter(format: string, data: Record<string, any>) {
  return format.replace(simplePlaceholderRegex, (placeholder: string, path: string) => {
    const value = picks(path, data);
    return toString(value);
  });
}

export default {
  name: STRING_FORMATTER,
  install() {
    return stringFormatter;
  }
} as VueFormilyPlugin;
