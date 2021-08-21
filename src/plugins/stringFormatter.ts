import { VueFormilyPlugin } from '../types';
import { STRING_FORMATTER } from '../constants';
import { flatArray, picks, toString } from '../utils';

const simplePlaceholderRegex = /\{([^{}]+)\}/g;

function formatString(format: string, data: Record<string, any> | Record<string, any>[]) {
  return format.replace(simplePlaceholderRegex, (placeholder: string, path: string) => {
    const value = picks(path, ...flatArray(data));
    return toString(value);
  });
}

export default {
  name: STRING_FORMATTER,
  format: formatString,
  install() {
    return this;
  },
  options: {}
} as VueFormilyPlugin & {
  format(format: string, data: Record<string, any> | Record<string, any>[]): string;
};
