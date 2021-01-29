import { getPlug } from "@/helpers";
import { Localizer } from "@/types";
import DateTime from "./DateTime";
import { DateTimeFormatter } from "./formatters/datetime";

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

const formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g
const escapedStringRegExp = /^'([^]*?)'?$/
const doubleQuoteRegExp = /''/g

function cleanEscapedString(input: string) {
  const match = input.match(escapedStringRegExp);
  return match ? match[1].replace(doubleQuoteRegExp, "'") : input;
}

export const formatString = (...args: any[]) => getPlug('stringFormatter')(...args);

export function formatDateTime(date: Date, format: string, ...args: any[]) {
  const dateTimeFormatters: Record<string, DateTimeFormatter> = getPlug('datetime');
  const localizer = getPlug('localizer') as Localizer;

  return format
    .replace(formattingTokensRegExp, (token: string, formatType: string) => {
      if (token === "''") {
        return "'"
      }

      if (formatType === "'") {
        return cleanEscapedString(token)
      }

      const formatter = dateTimeFormatters[formatType]

      if (formatter) {
        return localizer(formatter(new DateTime(date.getTime()), token), ...args);
      }

      return token;
    });
}
