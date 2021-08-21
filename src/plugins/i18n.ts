import { VueFormilyPlugin } from '../types';
import { flatArray, isPlainObject, isUndefined, merge, picks } from '../utils';
import { LOCALIZER } from '../constants';
import stringFormatter from './stringFormatter';

export type Resource = {
  [key: string]: string | string[] | Resource;
};

export type Locale = {
  code: string;
  localize?: Record<string, any>;
  resource?: Resource;
};

export type I18nOptions = {
  locale: string;
  locales?: Locale[];
};

let _activeLocale = 'en-US';
const _locales: Record<string, Locale> = {};

export default {
  name: LOCALIZER,
  switchLocale(locale: string = _activeLocale) {
    if (!_locales[locale]) {
      throw new Error(`${locale} does not exist.`);
    }

    _activeLocale = locale;
  },
  addLocale(locale: Locale) {
    if (isPlainObject(locale)) {
      _locales[locale.code] = locale;
    }
  },
  removeLocale(locale: string) {
    delete _locales[locale];
  },
  getLocale(locale: string) {
    return _locales[locale];
  },
  translate(
    key: string,
    data?: Record<string, any> | Record<string, any>[],
    { locale = _activeLocale }: { locale?: string } = {}
  ) {
    const loc = _locales[locale] || {};

    const format = picks(key, loc.resource);

    return stringFormatter.format(!isUndefined(format) ? format : key, flatArray(data, loc.localize));
  },
  install(options: I18nOptions) {
    const { locales = [], locale = _activeLocale } = merge({}, this.options, options) as I18nOptions;

    locales.forEach(locale => this.addLocale(locale));

    this.switchLocale(locale);

    return this;
  },
  options: {} as I18nOptions
} as VueFormilyPlugin & {
  addLocale(locale: Locale): void;
  switchLocale(locale: string): void;
  removeLocale(locale: string): void;
  getLocale(locale: string): Locale;
  translate(
    key: string,
    data?: Record<string, any> | Record<string, any>[] | undefined,
    {
      locale
    }?: {
      locale?: string | undefined;
    }
  ): string;
};
