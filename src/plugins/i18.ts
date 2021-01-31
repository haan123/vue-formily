import { Localizer } from "@/types";
import { STRING_FORMATTER } from "../constants";
import { getPlug } from "../helpers";
import { merge } from "../utils";

export type Resource = Record<string, string>;

export type I18 = {
  translate: Localizer;
  setResource: (locale: string, resource: Resource) => void;
};

const _resources: Record<string, Resource> = {};

export default {
  translate(value: string, props: Record<string, any> = {}, data: Record<string, any> = {}) {
    const ressource = _resources[data.locale || 'en-US'];
    const stringFormatter = getPlug(STRING_FORMATTER);

    return stringFormatter(value, merge(ressource, props));
  },

  setResource(locale: string, resource: Record<string, string>) {
    _resources[locale] = resource;
  }
}

