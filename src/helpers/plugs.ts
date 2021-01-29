import { logError } from "@/utils";

const _plugs: Record<string, any> = {};

export function plug(name: string, p: any) {
  _plugs[name] = p;
}

export function getPlug(name: string) {
  const plug = _plugs[name];

  if (!plug) {
    logError(`${name} plugin was not found . See ___ for more infos.`);
  }

  return plug;
}
