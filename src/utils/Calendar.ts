import { getter } from ".";
import { isNullOrUndefined, isPlainNumber, isString } from "./assertions";
import { ref, setter } from "./objects";

const ladder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
/**
 * Hold monday column values then generate the rest days on this value
 * M T W T F S S
 * 1 2 3 4 5 6 7
 * 7 1 2 3 4 5 6
 * 6 7 1 2 3 4 5
 * 5 6 7 1 2 3 4
 * 4 5 6 7 1 2 3
 * 3 4 5 6 7 1 2
 * 2 3 4 5 6 7 1
 */
const weeksMap = [1, 7, 6, 5, 4 ,3 , 2];
const rsep = /^[, \u200e]+/;
const rtimezone = /([+-])(\d{1,2})(?::(\d{1,2}))?/;
const MINUTE = 60000;
const HOUR = 60 * MINUTE;

export function isLeapYear(year: number) {
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

function computeWeeksInYear(year: number) {
  const wiy1 = wiy(year);
  const wiy2 = wiy(year - 1);

  return 52 + (wiy1 === 4 || wiy2 === 3 ? 1 : 0);
}

function computeOrdinal({ year, month, day }: { year: number, month: number, day: number }) {
  return day + ladder[month - 1] + (isLeapYear(year) && month > 2 ? 1 : 0);
}

function gregorianToWeek(cal: Calendar) {
  const { year, month, day, minimalDaysInFirstWeek } = cal;
  const ordinal = computeOrdinal({ year, month, day });
  /**
   * Ref: https://en.wikipedia.org/wiki/ISO_week_date
   * The week number (WW or woy for week of year) of any date can be calculated, given its ordinal date (i.e. day of the year, doy or DDD, 1–365 or 366) and its day of the week (D or dow, 1–7).
   * woy = (10 + doy − dow) div 7
   * where
   * doy = 1 → 365/366, dow = 1 → 7 og div means integer division (i.e. the remainder after a division is discarded).
   */
  let weekInYear = Math.floor(((14 - minimalDaysInFirstWeek) + ordinal - cal.getDayOfWeek()) / 7);
  let weekYear;

  if (weekInYear < 1) {
    weekYear = year - 1;
    weekInYear = computeWeeksInYear(weekYear)
  } else if (weekInYear > computeWeeksInYear(year)) {
    weekYear = year + 1;
    weekInYear = 1;
  } else {
    weekYear = year;
  }

  return { weekYear, weekInYear };
}

function dtfFormat({ date, timeZoneName, locale = 'en-US', timeZone }: { date?: Date; timeZoneName?: string; locale?: string, timeZone?: string } = {}) {
  return new Intl.DateTimeFormat(locale, {
    timeZoneName,
    timeZone
  }).format(date)
}

export type CalendarOptions = {
  // 1 -> 7 ~ monday -> sunday
  firstDayOfWeek?: number;
  // 1 -> 7
  minimalDaysInFirstWeek?: number;
  timeZone?: any;
}

function extractTimeZoneOffset(timeZone: string): number | null {
  const match = timeZone.match(rtimezone);

  if (match) {
    const [, sign, hours, minutes] = match;
    return ((+hours * HOUR) + (minutes ? +minutes * MINUTE : 0)) * (sign === '+' ? 1 :- 1);
  }

  return null
}

export function parseTime(offset: number) {
  const seconds = Math.trunc(Math.abs(offset / 1000));
  const hours = Math.trunc(Math.abs(seconds / 3600));
  const minutes = Math.trunc(Math.abs(seconds % 60));
  const sign = offset >= 0 ? '+' : '-';

  return {
    hours,
    minutes,
    seconds,
    sign
  }
}

export class Calendar {
  static MONDAY = 0;
  static TUESDAY = 1;
  static WEDNESDAY = 2;
  static THURSDAY = 3;
  static FRIDAY = 4;
  static SATURDAY = 5;
  static SUNDAY = 6;

  readonly millisecond!: number;
  readonly second!: number;
  readonly minute!: number;
  readonly hour!: number;
  readonly month!: number;
  readonly year!: number;
  readonly day!: number;
  readonly timeZone!: string;
  readonly instance!: Date;
  readonly timestamp!: number;
  offset!: number;
  minimalDaysInFirstWeek!: number;
  firstDayOfWeek!: number;

  constructor(timestamp: number | Date, options: CalendarOptions = {}) {
    this.timestamp = (timestamp instanceof Date ? timestamp.getTime() : timestamp) || Date.now();

    const offset = ref();
    const timeZone = ref();
    const instance = ref();

    getter(this, 'offset', offset);
    setter(this, 'timeZone', timeZone, (val?: string | number) => {
      let os;
      let tz;

      if (isPlainNumber(val)) {
        os = val;
        tz = 'UTC';
      } else {
        if (isNullOrUndefined(val)) {
          tz = new Intl.DateTimeFormat().resolvedOptions().timeZone;
        } else if (this.isValidTimeZone(val)) {
          tz = val;
        } else {
          throw new Error('invalid timezone format')
        }

        const formatted = dtfFormat({ date: this.instance, timeZoneName: 'short', timeZone: val })
        os = extractTimeZoneOffset(formatted);
      }

      offset.value = os;
      timeZone.value = tz;
      instance.value = new Date(this.timestamp + this.offset);
    });

    const { minimalDaysInFirstWeek = 4, firstDayOfWeek = Calendar.MONDAY } = options;

    this.timeZone = options.timeZone;
    this.firstDayOfWeek = +firstDayOfWeek;
    this.minimalDaysInFirstWeek = +minimalDaysInFirstWeek;

    getter(this, 'instance', instance);
    getter(this, 'year', () => this.instance.getUTCFullYear());
    getter(this, 'month', () => this.instance.getUTCMonth() + 1);
    getter(this, 'day', () => this.instance.getUTCDate());
    getter(this, 'hour', () => this.instance.getUTCHours());
    getter(this, 'minute', () => this.instance.getUTCMinutes());
    getter(this, 'second', () => this.instance.getUTCSeconds());
    getter(this, 'millisecond', () => this.instance.getUTCMilliseconds());
  }

  isValidTimeZone(timeZone: string) {
    try {
      dtfFormat({ timeZone });
      return true;
    } catch (e) {
      return false;
    }
  }

  getWeekInYear() {
    return gregorianToWeek(this).weekInYear;
  }

  getWeekYear() {
    return gregorianToWeek(this).weekYear;
  }

  getDayInYear() {
    let diy = ladder[this.month - 1] + this.day;

    if (this.month > 2 && isLeapYear(this.year)) {
      diy += 1
    }

    return diy
  }

  getDayOfWeek() {
    const utcDay = this.instance.getUTCDay()
    let i = weeksMap[this.firstDayOfWeek];
    const map = weeksMap.map(() => {
      if (i > 7) {
        i = 1
      }

      return i++
    });

    return map[utcDay === 0 ? 6 : utcDay - 1]
  }

  getTimeZoneName({ format, locale = 'en-US' }: { format?: string; locale?: string } = {}) {
    const { instance: date, timeZone } = this;

    const short = dtfFormat({ date, timeZone });
    const long = dtfFormat({ date, timeZone, locale, timeZoneName: format });

    const diffed = long.substring(short.length);
    const trimmed = diffed.replace(rsep, '');

    return trimmed;
  }
}
