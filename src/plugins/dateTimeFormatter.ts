import { zeroPad, DateTime } from '../utils';

export type DateTimeFormatter = (dt: DateTime, token: string) => string;

const formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g
const escapedStringRegExp = /^'([^]*?)'?$/
const doubleQuoteRegExp = /''/g

function cleanEscapedString(input: string) {
  const match = input.match(escapedStringRegExp);
  return match ? match[1].replace(doubleQuoteRegExp, "'") : input;
}

const MILLISECONDS_IN_DAY = 86400000;

function formatYear(input: number, token: string) {
  const length = token.length;

  return zeroPad(length === 2 ? ('' + input).slice(-2) : input, length) + '';
}

const _lengthNames = ['narrow', 'short', 'long'];

function getLengthName(length: number) {
  return _lengthNames[Math.min(2, length > 0 ? length - 1 : 0)]
}

function weekInMonth(year: number, month: number, day: number) {
  const dow = DateTime.dayOfWeek(year, month, day);
  const remain = day - dow;

  return Math.floor(remain > 0 ? 1 + (remain / 7) + (remain % 7 !== 0 ? 1 : 0) : 1)
}

export const formatters: Record<string, DateTimeFormatter> = {
  // Era designator, e.g, AD
  G(dt: DateTime, token: string) {
    return `{era_${getLengthName(token.length)}_${dt.year < 0 ? 'b' : 'a'}}`;
  },
  // Year, e.g, 2021; 21
  y(dt: DateTime, token: string) {
    return formatYear(dt.year, token);
  },
  // Week year, e.g, 2009; 09
  Y(dt: DateTime, token: string) {
    return formatYear(dt.weekYear, token);
  },
  // Month in year, e.g, July; Jul; 07
  M(dt: DateTime, token: string) {
    const length = token.length;

    if (length === 1) {
      return '' + dt.month;
    } else if (length === 2) {
      return zeroPad(dt.month, 2);
    }

    return `{month_${getLengthName(token.length - 2)}_${dt.month}}`;
  },
  // Week in year, e.g, 27
  w(dt: DateTime, token: string) {
    return zeroPad(dt.weekInYear, token.length);
  },
  // Week in month, e.g, 2
  W(dt: DateTime, token: string) {
    return zeroPad(weekInMonth(dt.year, dt.month, dt.day), token.length);
  },
  // Day in year, e.g, 231
  D(dt: DateTime, token: string) {
    const start = new Date(dt.timestamp);
    start.setUTCMonth(0, 1);
    start.setUTCHours(0, 0, 0, 0);

    return zeroPad(Math.floor((dt.timestamp - start.getTime()) / MILLISECONDS_IN_DAY), token.length);
  },
  // Day in month, e.g, 12
  d(dt: DateTime, token: string) {
    return zeroPad(dt.day, token.length);
  },
  // Day of week in month, e.g, 2 (2nd thursday in month)
  F(dt: DateTime, token: string) {
    const { year, month, day } = dt;
    const wim = weekInMonth(year, month, day);
    const dow = DateTime.dayOfWeek(year, month, day);
    const firstDowInMonth = DateTime.dayOfWeek(year, month, 1);

    return zeroPad(wim - (dow === firstDowInMonth ? 0 : 1), token.length);
  },
  // Day name in week, e.g, Tuesday; Tue
  E(dt: DateTime, token: string) {
    return `{weekday_${getLengthName(token.length)}_${dt.weekday - 1}}`;
  },
  // Day number of week (1 = Monday, ..., 7 = Sunday)
  u(dt: DateTime, token: string) {
    return zeroPad(dt.weekday, token.length);
  },
  // Am/pm marker
  a(dt: DateTime) {
    return dt.hour < 12 ? 'AM' : 'PM';
  },
  // Hour in day (0-23)
  H(dt: DateTime, token: string) {
    return zeroPad(dt.hour, token.length);
  },
  // Hour in day (1-24)
  k(dt: DateTime, token: string) {
    return zeroPad(dt.hour + 1, token.length);
  },
  // Hour in am/pm (0-11)
  K(dt: DateTime, token: string) {
    const h = dt.hour % 12;
    return zeroPad(h === 0 ? 11 : h - 1, token.length);
  },
  // Hour in am/pm (1-12)
  h(dt: DateTime, token: string) {
    const h = dt.hour % 12;
    return zeroPad(h === 0 ? 12 : h, token.length);
  },
  // Minute in hour
  m(dt: DateTime, token: string) {
    return zeroPad(dt.minute, token.length);
  },
  // Second in minute
  s(dt: DateTime, token: string) {
    return zeroPad(dt.second, token.length);
  },
  // Second in minute
  S(dt: DateTime, token: string) {
    return zeroPad(dt.millisecond, token.length);
  },
  // General time zone, e.g, Pacific Standard Time; PST; GMT-08:00
  z(dt: DateTime, token: string) {
    const length = token.length;

    if (length < 4) {
      return dt.offsetName({ timeZoneName: 'short' });
    } else {
      return dt.offsetName({ timeZoneName: 'long' });
    }
  },
  // RFC 2822 time zone, e.g, -0800
  Z(dt: DateTime) {
    const offset = dt.offset;
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.trunc(Math.abs(offset / 60));
    const minutes = Math.trunc(Math.abs(offset % 60));

    return `${sign}${zeroPad(hours, 2)}${zeroPad(minutes, 2)}`;
  },
  // ISO 8601 time zone, e.g, -08; -0800; -08:00
  X(dt: DateTime, token: string) {
    const offset = dt.offset;

    if (offset === 0) {
      return 'Z';
    }

    const hours = Math.trunc(Math.abs(offset / 60));
    const minutes = Math.trunc(Math.abs(offset % 60));
    const sign = offset >= 0 ? '+' : '-';
    const length = token.length;
    const lead = `${sign}${zeroPad(hours, 2)}`;

    if (length === 1) {
      return lead;
    } else if (length === 2) {
      return `${lead}${zeroPad(minutes, 2)}`;
    } else if (length === 3) {
      return `${lead}${minutes > 0 ? `:${zeroPad(minutes, 2)}` : ''}`;
    }

    throw new RangeError(`invalid ISO 8601 format: length=${length}`);
  }
}

export default function dateTimeFormatter(date: Date, format: string){
  return format
    .replace(formattingTokensRegExp, (token: string, formatType: string) => {
      if (token === "''") {
        return "'"
      }

      if (formatType === "'") {
        return cleanEscapedString(token)
      }

      const formatter = formatters[formatType]

      if (formatter) {
        return formatter(new DateTime(date.getTime()), token);
      }

      return token;
    });
}
