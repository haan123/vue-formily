import { DATE_TIME_FORMATTER, LOCALIZER, STRING_FORMATTER } from "@/constants";
import { getPlug, plug } from "@/helpers";
import dateTimeFormatter from "@/plugins/dateTimeFormatter";
import i18, { I18 } from "@/plugins/i18";
import stringFormatter from "@/plugins/stringFormatter";
import en from '@/resources/en-US';
import { Calendar } from "@/utils/Calendar";

plug(LOCALIZER, i18);
plug(DATE_TIME_FORMATTER, dateTimeFormatter);
plug(STRING_FORMATTER, stringFormatter);

describe('dateTimeFormatter', () => {
  const formatter = getPlug(DATE_TIME_FORMATTER);
  const localizer = getPlug(LOCALIZER) as I18;

  localizer.setResource('en-US', en);

  const date = new Date('2020-12-27T08:06:10.941Z');

  it('Should output `G GG GGG GGGG GGGGG` as keys', async () => {
    expect(formatter('G GG GGG GGGG GGGGG', date)).toBe('{era_narrow[0]} {era_short[0]} {era_long[0]} {era_long[0]} {era_long[0]}');
  });

  it('Should output `G GG GGG GGGG GGGGG` as localized strings', async () => {
    expect(localizer.translate(formatter('G GG GGG GGGG GGGGG', date))).toBe('A AD Anno Domini Anno Domini Anno Domini');
  });

  it('y yy yyy yyyy yyyyy', async () => {
    expect(formatter('y yy yyy yyyy yyyyy', date)).toBe('2020 20 2020 2020 02020');
  });

  it('Y YY YYY YYYY YYYYY', async () => {
    expect(formatter('Y YY YYY YYYY YYYYY', date)).toBe('2020 20 2020 2020 02020');
    expect(formatter('Y YY YYY YYYY YYYYY', new Date('2021-01-03T08:06:10.941Z'))).toBe('2020 20 2020 2020 02020');
    expect(formatter('Y YY YYY YYYY YYYYY', new Date('2021-01-04T08:06:10.941Z'))).toBe('2021 21 2021 2021 02021');
  });

  it('M MM MMM MMMM MMMMM', async () => {
    expect(localizer.translate(formatter('M MM MMM MMMM MMMMM', date))).toBe('12 12 D Dec December');
  });

  it('w ww www wwww wwwww', async () => {
    // default ISO 8601
    expect(formatter('w ww www wwww wwwww', new Date('2021-01-06'))).toBe('1 01 001 0001 00001');
    // gregorian
    expect(formatter('w ww www wwww wwwww', new Date('2021-01-06'), {
      minimalDaysInFirstWeek: 1
    })).toBe('2 02 002 0002 00002');
    expect(formatter('w ww www wwww wwwww', new Date('2020-02-29'), {
      minimalDaysInFirstWeek: 1
    })).toBe('9 09 009 0009 00009');
    expect(formatter('w ww www wwww wwwww', new Date('2020-02-29'), {
      minimalDaysInFirstWeek: 1,
      firstDayOfWeek: Calendar.SUNDAY,
    })).toBe('9 09 009 0009 00009');
  });

  it('W WW WWW WWWW WWWWW', async () => {
    expect(formatter('W WW WWW WWWW WWWWW', new Date('2021-01-18'))).toBe('4 04 004 0004 00004');
  });

  it('D DD DDD DDDD DDDDD', async () => {
    expect(formatter('D DD DDD DDDD DDDDD', date)).toBe('362 362 362 0362 00362');
  });

  it('d dd ddd dddd ddddd', async () => {
    expect(formatter('d dd ddd dddd ddddd', date)).toBe('27 27 027 0027 00027');
  });

  it('F FF FFF FFFF FFFFF', async () => {
    expect(formatter('F FF FFF FFFF FFFFF', date)).toBe('4 04 004 0004 00004');
    expect(formatter('F FF FFF FFFF FFFFF', new Date('2020-12-07'))).toBe('1 01 001 0001 00001');
    expect(formatter('F FF FFF FFFF FFFFF', new Date('2020-08-06'))).toBe('1 01 001 0001 00001');
    expect(formatter('F FF FFF FFFF FFFFF', new Date('2020-08-04'), {
      firstDayOfWeek: Calendar.SUNDAY
    })).toBe('1 01 001 0001 00001');
  });

  it('E EE EEE EEEE EEEEE', async () => {
    expect(localizer.translate(formatter('E EE EEE EEEE EEEEE', date))).toBe('S Sun Sunday Sunday Sunday');
  });

  it('u uu uuu uuuu uuuuu', async () => {
    expect(formatter('u uu uuu uuuu uuuuu', date)).toBe('7 07 007 0007 00007');
    expect(formatter('u uu uuu uuuu uuuuu', date, {
      firstDayOfWeek: Calendar.SUNDAY
    })).toBe('1 01 001 0001 00001');
  });

  it('a aa aaa aaaa aaaaa', async () => {
    expect(formatter('a aa aaa aaaa aaaaa', date)).toBe('PM PM PM PM PM');
    expect(formatter('a aa aaa aaaa aaaaa', new Date('2020-12-27T01:06:10.941Z'))).toBe('AM AM AM AM AM');
  });

  it('H HH HHH HHHH HHHHH', async () => {
    expect(formatter('H HH HHH HHHH HHHHH', date)).toBe('15 15 015 0015 00015');
    expect(formatter('H HH HHH HHHH HHHHH', new Date('2020-12-27T17:06:10.941Z'))).toBe('0 00 000 0000 00000');
  });

  it('k kk kkk kkkk kkkkk', async () => {
    expect(formatter('k kk kkk kkkk kkkkk', date)).toBe('15 15 015 0015 00015');
    expect(formatter('k kk kkk kkkk kkkkk', new Date('2020-12-27T17:06:10.941Z'))).toBe('24 24 024 0024 00024');
  });

  it('K KK KKK KKKK KKKKK', async () => {
    expect(formatter('K KK KKK KKKK KKKKK', date)).toBe('3 03 003 0003 00003');
    expect(formatter('K KK KKK KKKK KKKKK', new Date('2020-12-27T06:06:10.941Z'))).toBe('1 01 001 0001 00001');
  });

  it('h hh hhh hhhh hhhhh', async () => {
    expect(formatter('h hh hhh hhhh hhhhh', date)).toBe('3 03 003 0003 00003');
    expect(formatter('h hh hhh hhhh hhhhh', new Date('2020-12-27T05:06:10.941Z'))).toBe('12 12 012 0012 00012');
  });

  it('m mm mmm mmmm mmmmm', async () => {
    expect(formatter('m mm mmm mmmm mmmmm', date)).toBe('6 06 006 0006 00006');
  });

  it('s ss sss ssss sssss', async () => {
    expect(formatter('s ss sss ssss sssss', date)).toBe('10 10 010 0010 00010');
  });

  it('S SS SSS SSSS SSSSS', async () => {
    expect(formatter('S SS SSS SSSS SSSSS', date)).toBe('941 941 941 0941 00941');
  });

  it('z zz zzz zzzz zzzzz', async () => {
    expect(formatter('z zz zzz zzzz zzzzz', date)).toBe('GMT+7 GMT+7 GMT+7 Indochina Time Indochina Time');
    expect(formatter('z zz zzz zzzz zzzzz', date, {
      timeZone: 'UTC'
    })).toBe('UTC+0 UTC+0 UTC+0 Coordinated Universal Time Coordinated Universal Time');
    expect(formatter('z zz zzz zzzz zzzzz', date, {
      timeZone: 25200000
    })).toBe('UTC+7 UTC+7 UTC+7 Coordinated Universal Time Coordinated Universal Time');
  });

  it('Z ZZ ZZZ ZZZZ ZZZZZ', async () => {
    expect(formatter('Z ZZ ZZZ ZZZZ ZZZZZ', date)).toBe('+0700 +0700 +0700 +0700 +0700');
  });

  it('X XX XXX XXXX XXXXX', async () => {
    expect(formatter('X XX XXX', date)).toBe('+07 +0700 +07');
  });
});
