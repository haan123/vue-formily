import { def } from ".";

const ladder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/**
 * Ref: https://en.wikipedia.org/wiki/ISO_week_date
 * The number of weeks in a given year is equal to the corresponding week number of 28 December, because it is the only date that is always in the last week of the year since it is a week before 4 January which is always in the first week of the following year.
 *
 * Using only the ordinal year number y, the number of weeks in that year can be determined:[1]
 *
 * p(y) = (y + (y /4) - (y / 100) + (y / 400)) % 7
 * weeks(y) = 52 + (p(y) === 4 || p(y - 1) === 3 ? 1 : 0)
 */
function wiy(year: number) {
  return (year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)) % 7;
}

function computeWeekInYear(weekYear: number) {
  const wiy1 = wiy(weekYear);
  const wiy2 = wiy(weekYear - 1);

  return 52 + (wiy1 === 4 || wiy2 === 3 ? 1 : 0);
}

function computeOrdinal(year: number, month: number, day: number) {
  return day + ladder[month - 1] + (isLeapYear(year) && month > 2 ? 1 : 0);
}

function gregorianToWeek(gregObj: DateTime) {
  const { year, month, day } = gregObj;
  const ordinal = computeOrdinal(year, month, day);
  const weekday = DateTime.dayOfWeek(year, month, day);
  /**
   * Ref: https://en.wikipedia.org/wiki/ISO_week_date
   * The week number (WW or woy for week of year) of any date can be calculated, given its ordinal date (i.e. day of the year, doy or DDD, 1–365 or 366) and its day of the week (D or dow, 1–7).
   * woy = (10 + doy − dow) div 7
   * where
   * doy = 1 → 365/366, dow = 1 → 7 og div means integer division (i.e. the remainder after a division is discarded).
   */
  let weekNumber = Math.floor((10 + ordinal - weekday) / 7);
  let weekYear;
  let weekInYear;

  if (weekNumber < 1) {
    weekYear = year - 1;
    weekInYear = computeWeekInYear(weekYear);
  } else if (weekNumber > computeWeekInYear(year)) {
    weekYear = year + 1;
    weekInYear = 1;
  } else {
    weekYear = year;
  }

  return { weekYear, weekInYear, weekday };
}

export default class DateTime {
  readonly millisecond!: number;
  readonly second!: number;
  readonly minute!: number;
  readonly hour!: number;
  readonly month!: number;
  readonly year!: number;
  readonly day!: number;
  readonly timestamp!: number;
  readonly offset!: number;
  readonly instance!: Date;
  readonly timeZone!: string;
  readonly weekday!: number;
  readonly weekYear!: number;
  readonly weekInYear!: number;

  static dayOfWeek(year: number, month: number, day: number) {
    const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    return dow === 0 ? 7 : dow;
  }

  constructor(timestamp: number) {
    def(this, 'timestamp', timestamp || Date.now());
    def(this, 'offset', -new Date(this.timestamp).getTimezoneOffset());

    const date = new Date(this.timestamp + this.offset * 60 * 1000);
    const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

    const w = gregorianToWeek(this);

    def(this, 'instance', date);
    def(this, 'year', date.getUTCFullYear());
    def(this, 'month', date.getUTCMonth() + 1);
    def(this, 'day', date.getUTCDate());
    def(this, 'hour', date.getUTCHours());
    def(this, 'minute', date.getUTCMinutes());
    def(this, 'second', date.getUTCSeconds());
    def(this, 'millisecond', date.getUTCMilliseconds());
    def(this, 'timeZone', timeZone);
    def(this, 'weekday', w.weekday);
    def(this, 'weekYear', w.weekYear);
    def(this, 'weekInYear', w.weekInYear);
  }

  offsetName({ timeZoneName, locale = 'en-US' }: { timeZoneName?: string; locale?: string } = {}) {
    const short = new Intl.DateTimeFormat(locale).format(this.instance);
    const long = new Intl.DateTimeFormat(locale, {
      timeZoneName
    }).format(this.instance);

    const diffed = long.substring(short.length);
    const trimmed = diffed.replace(/^[, \u200e]+/, '');

    return trimmed;
  }
}
