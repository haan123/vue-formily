import { VueFormilyPlugin } from '../types';

const _plugs: Record<string, any> = {};

export function plug(plugin: VueFormilyPlugin) {
  _plugs[plugin.name] = plugin.install();
}

export function unplug(name: string) {
  delete _plugs[name];
}

export function getPlug(name: string) {
  return _plugs[name];
}
