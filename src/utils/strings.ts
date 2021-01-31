export function logMessage(message?: string, infos?: Record<string, string>) {
  const infosText = infos
    ? `(${Object.keys(infos)
        .map((name: string) => `${name}: "${infos[name]}"`)
        .join(', ')}) `
    : '';
  return `[vue-formily] ${infosText}${message}`;
}

export function logWarn(message: string, infos?: Record<string, string>) {
  // eslint-disable-next-line no-console
  console.warn(logMessage(message, infos));
}

export function logError(message: string, infos?: Record<string, string>) {
  // eslint-disable-next-line no-console
  console.error(logMessage(message, infos));
}

export function zeroPad(input: string | number, targetLength: number) {
  const num = +input;
  const sign = num < 0 ? '-' : '';
  const length = ('' + Math.abs(num)).length;

  return targetLength > length ? `${sign}${Array(targetLength).concat([Math.abs(num)]).join('0').slice(-targetLength)}` : ('' + input);
}
