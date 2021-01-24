import * as English from "./english.js";
import { def } from "./objects.js";

const hasIntl = typeof Intl !== "undefined" && Intl.DateTimeFormat;
const nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

function stringifyTokens(splits, tokenToString) {
  let s = "";
  for (const token of splits) {
    if (token.literal) {
      s += token.val;
    } else {
      s += tokenToString(token.val);
    }
  }
  return s;
}

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function computeOrdinal(year: number, month: number, day: number) {
  return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
}

function dayOfWeek(year: number, month: number, day: number) {
  const js = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return js === 0 ? 7 : js;
}

function weeksInWeekYear(weekYear: number) {
  const p1 =
      (weekYear +
        Math.floor(weekYear / 4) -
        Math.floor(weekYear / 100) +
        Math.floor(weekYear / 400)) %
      7;
    const last = weekYear - 1;
    const p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) + Math.floor(last / 400)) % 7;

  return p1 === 4 || p2 === 3 ? 53 : 52;
}

function gregorianToWeek(gregObj: DateTime) {
  const { year, month, day } = gregObj,
    ordinal = computeOrdinal(year, month, day),
    weekday = dayOfWeek(year, month, day);

  let weekNumber = Math.floor((ordinal - weekday + 10) / 7),
    weekYear;

  if (weekNumber < 1) {
    weekYear = year - 1;
    weekNumber = weeksInWeekYear(weekYear);
  } else if (weekNumber > weeksInWeekYear(year)) {
    weekYear = year + 1;
    weekNumber = 1;
  } else {
    weekYear = year;
  }

  return { weekYear, weekNumber, weekday };
}

class DateTime {
  readonly millisecond!: number;
  readonly second!: number;
  readonly minute!: number;
  readonly hour!: number;
  readonly month!: number;
  readonly year!: number;
  readonly day!: number;
  readonly timestamp!: number;
  readonly offset!: number;
  readonly date!: Date;
  readonly zoneName!: string;
  readonly weekday!: number;
  readonly weekYear!: number;
  readonly weekNumber!: number;

  constructor(timestamp: number) {
    def(this, 'timestamp', timestamp || Date.now())
    def(this, 'offset', -new Date(this.timestamp).getTimezoneOffset())

    const date = new Date(this.timestamp + (this.offset * 60 * 1000));
    const zoneName = hasIntl ? new Intl.DateTimeFormat().resolvedOptions().timeZone : 'local';

    const w = gregorianToWeek(this);

    def(this, 'date', date);
    def(this, 'year', date.getUTCFullYear())
    def(this, 'month', date.getUTCMonth() + 1)
    def(this, 'day', date.getUTCDate())
    def(this, 'hour', date.getUTCHours())
    def(this, 'minute', date.getUTCMinutes())
    def(this, 'second', date.getUTCSeconds())
    def(this, 'millisecond', date.getUTCMilliseconds())
    def(this, 'zoneName', zoneName)
    def(this, 'weekday', w.weekday)
    def(this, 'weekNumber', w.weekNumber)
  }

  offsetName({ timeZoneName, locale }: { timeZoneName?:string, locale?: string } = {}) {
    const intlOpts = {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };

    const modified = Object.assign({ timeZoneName }, intlOpts);

    if (hasIntl) {
      const without = new Intl.DateTimeFormat(locale, intlOpts).format(this.date);
      const included = new Intl.DateTimeFormat(locale, modified).format(this.date);
      const diffed = included.substring(without.length);
      const trimmed = diffed.replace(/^[, \u200e]+/, '');

      return trimmed;
    } else {
      return null;
    }
  }
}

/**
 * @private
 */

export default class Formatter {
  static parseFormat(fmt: string) {
    let current = null,
      currentFull = "",
      bracketed = false;
    const splits = [];

    for (let i = 0; i < fmt.length; i++) {
      const c = fmt.charAt(i);
      if (c === "'") {
        if (currentFull.length > 0) {
          splits.push({ literal: bracketed, val: currentFull });
        }
        current = null;
        currentFull = "";
        bracketed = !bracketed;
      } else if (bracketed) {
        currentFull += c;
      } else if (c === current) {
        currentFull += c;
      } else {
        if (currentFull.length > 0) {
          splits.push({ literal: false, val: currentFull });
        }
        currentFull = c;
        current = c;
      }
    }

    if (currentFull.length > 0) {
      splits.push({ literal: bracketed, val: currentFull });
    }

    return splits;
  }

  locale: string;
  opts: any;

  constructor(locale: string, formatOpts: any) {
    this.opts = formatOpts;
    this.locale = locale;
  }

  formatDateTime(dt: DateTime, opts = {}) {
    const df = this.locale.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.format();
  }

  formatDateTimeParts(dt: DateTime, opts = {}) {
    const df = this.locale.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.formatToParts();
  }

  resolvedOptions(dt: DateTime, opts = {}) {
    const df = this.locale.dtFormatter(dt, Object.assign({}, this.opts, opts));
    return df.resolvedOptions();
  }

  num(n: number, p = 0) {
    const opts = Object.assign({}, this.opts);

    if (p > 0) {
      opts.padTo = p;
    }

    const inf = new Intl.NumberFormat(this.locale, opts);

    return inf.format(n);
  }

  formatDateTimeFromString(dt: DateTime, fmt: string) {
    const knownEnglish = this.locale.listingMode() === "en",
      useDateTimeFormatter =
        this.locale.outputCalendar && this.locale.outputCalendar !== "gregory" && hasFormatToParts(),
      string = (opts, extract) => this.locale.extract(dt, opts, extract),
      formatOffset = opts => {
        if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
          return "Z";
        }

        return dt.isValid ? dt.zone.formatOffset(dt.timestamp, opts.format) : "";
      },
      meridiem = () =>
        knownEnglish
          ? English.meridiemForDateTime(dt)
          : string({ hour: "numeric", hour12: true }, "dayperiod"),
      month = (length, standalone) =>
        knownEnglish
          ? English.monthForDateTime(dt, length)
          : string(standalone ? { month: length } : { month: length, day: "numeric" }, "month"),
      weekday = (length, standalone) =>
        knownEnglish
          ? English.weekdayForDateTime(dt, length)
          : string(
              standalone ? { weekday: length } : { weekday: length, month: "long", day: "numeric" },
              "weekday"
            ),
      era = length =>
        knownEnglish ? English.eraForDateTime(dt, length) : string({ era: length }, "era"),
      tokenToString = (token: string) => {
        // Where possible: http://cldr.unicode.org/translation/date-time-1/date-time#TOC-Standalone-vs.-Forat-Styles
        switch (token) {
          // ms
          case "S":
            return this.num(dt.millisecond);
          case "u":
          // falls through
          case "SSS":
            return this.num(dt.millisecond, 3);
          // seconds
          case "s":
            return this.num(dt.second);
          case "ss":
            return this.num(dt.second, 2);
          // minutes
          case "m":
            return this.num(dt.minute);
          case "mm":
            return this.num(dt.minute, 2);
          // hours
          case "h":
            return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
          case "hh":
            return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
          case "H":
            return this.num(dt.hour);
          case "HH":
            return this.num(dt.hour, 2);
          // offset
          case "Z":
            // like +6
            return formatOffset({ format: "narrow", allowZ: this.opts.allowZ });
          case "ZZ":
            // like +06:00
            return formatOffset({ format: "short", allowZ: this.opts.allowZ });
          case "ZZZ":
            // like +0600
            return formatOffset({ format: "techie", allowZ: this.opts.allowZ });
          case "ZZZZ":
            // like EST
            return dt.offsetName({ timeZoneName: "short", locale: this.locale });
          case "ZZZZZ":
            // like Eastern Standard Time
            return dt.offsetName({ timeZoneName: "long", locale: this.locale });
          // zone
          case "z":
            // like America/New_York
            return dt.zoneName;
          // meridiems
          case "a":
            return meridiem();
          // dates
          case "d":
            return useDateTimeFormatter ? string({ day: "numeric" }, "day") : this.num(dt.day);
          case "dd":
            return useDateTimeFormatter ? string({ day: "2-digit" }, "day") : this.num(dt.day, 2);
          // weekdays - standalone
          case "c":
            // like 1
            return this.num(dt.weekday);
          case "ccc":
            // like 'Tues'
            return weekday("short", true);
          case "cccc":
            // like 'Tuesday'
            return weekday("long", true);
          case "ccccc":
            // like 'T'
            return weekday("narrow", true);
          // weekdays - format
          case "E":
            // like 1
            return this.num(dt.weekday);
          case "EEE":
            // like 'Tues'
            return weekday("short", false);
          case "EEEE":
            // like 'Tuesday'
            return weekday("long", false);
          case "EEEEE":
            // like 'T'
            return weekday("narrow", false);
          // months - standalone
          case "L":
            // like 1
            return useDateTimeFormatter
              ? string({ month: "numeric", day: "numeric" }, "month")
              : this.num(dt.month);
          case "LL":
            // like 01, doesn't seem to work
            return useDateTimeFormatter
              ? string({ month: "2-digit", day: "numeric" }, "month")
              : this.num(dt.month, 2);
          case "LLL":
            // like Jan
            return month("short", true);
          case "LLLL":
            // like January
            return month("long", true);
          case "LLLLL":
            // like J
            return month("narrow", true);
          // months - format
          case "M":
            // like 1
            return useDateTimeFormatter
              ? string({ month: "numeric" }, "month")
              : this.num(dt.month);
          case "MM":
            // like 01
            return useDateTimeFormatter
              ? string({ month: "2-digit" }, "month")
              : this.num(dt.month, 2);
          case "MMM":
            // like Jan
            return month("short", false);
          case "MMMM":
            // like January
            return month("long", false);
          case "MMMMM":
            // like J
            return month("narrow", false);
          // years
          case "y":
            // like 2014
            return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year);
          case "yy":
            // like 14
            return useDateTimeFormatter
              ? string({ year: "2-digit" }, "year")
              : this.num(dt.year.toString().slice(-2), 2);
          case "yyyy":
            // like 0012
            return useDateTimeFormatter
              ? string({ year: "numeric" }, "year")
              : this.num(dt.year, 4);
          case "yyyyyy":
            // like 000012
            return useDateTimeFormatter
              ? string({ year: "numeric" }, "year")
              : this.num(dt.year, 6);
          // eras
          case "G":
            // like AD
            return era("short");
          case "GG":
            // like Anno Domini
            return era("long");
          case "GGGGG":
            return era("narrow");
          case "kk":
            return this.num(dt.weekYear.toString().slice(-2), 2);
          case "kkkk":
            return this.num(dt.weekYear, 4);
          case "W":
            return this.num(dt.weekNumber);
          case "WW":
            return this.num(dt.weekNumber, 2);
          case "o":
            return this.num(dt.ordinal);
          case "ooo":
            return this.num(dt.ordinal, 3);
          case "q":
            // like 1
            return this.num(dt.quarter);
          case "qq":
            // like 01
            return this.num(dt.quarter, 2);
          case "X":
            return this.num(Math.floor(dt.timestamp / 1000));
          case "x":
            return this.num(dt.timestamp);
          default:
            return maybeMacro(token);
        }
      };

    return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
  }
}
