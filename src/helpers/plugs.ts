const _plugs: Record<string, any> = {};

export function plug(name: string, p: any) {
  _plugs[name] = p;
}

export function unplug(name: string) {
  delete _plugs[name];
}

export function getPlug(name: string) {
  return _plugs[name];
}
