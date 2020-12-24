import { Localizer } from "../types";

let _localizer: Localizer = (value: string) => value

export function registerLocalizer(localizer: Localizer) {
  _localizer = localizer;
}

export function getLocalizer() {
  return _localizer;
}
