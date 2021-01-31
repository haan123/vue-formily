import { DATE_TIME_FORMATTER, LOCALIZER, STRING_FORMATTER } from "@/constants";
import { getPlug, plug } from "@/helpers";
import dateTimeFormatter from "@/plugins/dateTimeFormatter";
import i18, { I18 } from "@/plugins/i18";
import stringFormatter from "@/plugins/stringFormatter";
import { zeroPad } from "@/utils";
import en from '@/resources/en-US';

plug(LOCALIZER, i18);
plug(DATE_TIME_FORMATTER, dateTimeFormatter);
plug(STRING_FORMATTER, stringFormatter);

describe('strings utils', () => {
  const formatter = getPlug(DATE_TIME_FORMATTER);
  const localizer = getPlug(LOCALIZER) as I18;

  localizer.setResource('en-US', en);

  describe('zeroPad', () => {
    it('Can add leading zeros', async () => {
      expect(zeroPad(1, 2)).toBe('01');
      expect(zeroPad(12, 2)).toBe('12');
      expect(zeroPad(12, 3)).toBe('012');
      expect(zeroPad(-1, 3)).toBe('-001');
      expect(zeroPad(-.1, 3)).toBe('-0.1');
      expect(zeroPad(-.1, 4)).toBe('-00.1');
    });
  });

  describe('formatDateTime', () => {
    const date = new Date('2021-01-27T08:06:10.941Z');

    it('Should output `G GG GGG GGGG GGGGG` as keys', async () => {
      expect(formatter(date, 'G GG GGG GGGG GGGGG')).toBe('{era_narrow_a} {era_short_a} {era_long_a} {era_long_a} {era_long_a}');
    });

    it('Should output `G GG GGG GGGG GGGGG` as localized strings', async () => {
      expect(localizer.translate(formatter(date, 'G GG GGG GGGG GGGGG'))).toBe('A AD Anno Domini Anno Domini Anno Domini');
    });
  });
});
