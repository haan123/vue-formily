import { localizer, plug } from "@/helpers";
import { dateTimeFormatters } from '@/utils/formatters'
import { formatDateTime, zeroPad } from "@/utils";

plug('localizer', localizer);
plug('datetime', dateTimeFormatters);

describe('strings utils', () => {
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

    it('G GG GGG GGGG GGGGG', async () => {
      expect(formatDateTime(date, 'G GG GGG GGGG GGGGG')).toBe('');
    });
  });
});
