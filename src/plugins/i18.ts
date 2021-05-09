import { Localizer } from "@/types";
import { STRING_FORMATTER } from "../constants";
import { getPlug } from "../helpers";
import { merge } from "../utils";

export type Resource = Record<string, string | string[]>;

export type I18 = {
  translate: Localizer;
  setResource: (locale: string, resource: Resource) => void;
};

const _resources: Record<string, Resource> = {};

export default {
  translate(format: string, data: Record<string, any> = {}, options: Record<string, any> = {}) {
    const ressource = _resources[options.locale || 'en-US'];
    const stringFormatter = getPlug(STRING_FORMATTER);

    return stringFormatter(format, merge(ressource, data));
  },

  setResource(locale: string, resource: Record<string, string | string[]>) {
    _resources[locale] = resource;
  }
}

