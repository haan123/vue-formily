import { Localizer } from "../types";
import { merge } from "../utils";
import { stringFormatter } from "../utils/formatters";
import { getPlug } from "./plugs";

export const localizer: Localizer = (value: string, props: Record<string, any> = {}, data: Record<string, any> = {}) => {
  const ressource = getPlug(`resource.${data.locale || 'en-US'}`);

  return stringFormatter(value, merge(ressource, props), data);
};
