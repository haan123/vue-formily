import { DATE_TIME_FORMATTER, LOCALIZER, STRING_FORMATTER } from "@/constants";
import { getPlug, plug } from "@/helpers";
import dateTimeFormatter from "@/plugins/dateTimeFormatter";
import i18, { I18 } from "@/plugins/i18";
import stringFormatter from "@/plugins/stringFormatter";
import en from '@/resources/en-US';

plug(LOCALIZER, i18);
plug(DATE_TIME_FORMATTER, dateTimeFormatter);
plug(STRING_FORMATTER, stringFormatter);

describe('dateTimeFormatter', () => {
  const formatter = getPlug(DATE_TIME_FORMATTER);
  const localizer = getPlug(LOCALIZER) as I18;

  localizer.setResource('en-US', en);

  const date = new Date('2020-12-27T08:06:10.941Z');

  it('Should output `G GG GGG GGGG GGGGG` as keys', async () => {
    expect(formatter(date, 'G GG GGG GGGG GGGGG')).toBe('{era_narrow[0]} {era_short[0]} {era_long[0]} {era_long[0]} {era_long[0]}');
  });

  it('Should output `G GG GGG GGGG GGGGG` as localized strings', async () => {
    expect(localizer.translate(formatter(date, 'G GG GGG GGGG GGGGG'))).toBe('A AD Anno Domini Anno Domini Anno Domini');
  });

  it('y yy yyy yyyy yyyyy', async () => {
    expect(formatter(date, 'y yy yyy yyyy yyyyy')).toBe('2020 20 2020 2020 02020');
  });

  it('Y YY YYY YYYY YYYYY', async () => {
    expect(formatter(date, 'Y YY YYY YYYY YYYYY')).toBe('2020 20 2020 2020 02020');
    expect(formatter(new Date('2021-01-03T08:06:10.941Z'), 'Y YY YYY YYYY YYYYY')).toBe('2020 20 2020 2020 02020');
    expect(formatter(new Date('2021-01-04T08:06:10.941Z'), 'Y YY YYY YYYY YYYYY')).toBe('2021 21 2021 2021 02021');
  });

  it('M MM MMM MMMM MMMMM', async () => {
    expect(localizer.translate(formatter(date, 'M MM MMM MMMM MMMMM'))).toBe('12 12 D Dec December');
  });

  it('w ww www wwww wwwww', async () => {
    // default ISO 8601
    expect(formatter(new Date('2021-01-06'), 'w ww www wwww wwwww')).toBe('1 01 001 0001 00001');
    expect(formatter(new Date('2020-02-29'), 'w ww www wwww wwwww', {
      minimalDaysInFirstWeek: 1
    })).toBe('9 09 009 0009 00009');
    expect(formatter(new Date('2020-02-29'), 'w ww www wwww wwwww', {
      minimalDaysInFirstWeek: 1,
      firstDayOfWeek: 7,
    })).toBe('9 09 009 0009 00009');
  });

  it('W WW WWW WWWW WWWWW', async () => {
    expect(formatter(new Date('2021-01-18'), 'W WW WWW WWWW WWWWW')).toBe('4 04 004 0004 00004');
  });
});
