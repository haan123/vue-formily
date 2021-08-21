import { VueFormilyPlugin } from '../types';

const _plugs: Record<string, VueFormilyPlugin> = {};

export function plug(plugin: VueFormilyPlugin, ...args: any[]) {
  _plugs[plugin.name] = plugin.install(...args);
}

export function unplug(name: string) {
  delete _plugs[name];
}

export function getPlug(name: string) {
  return _plugs[name];
}
