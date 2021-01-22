describe('strings utils', () => {
  describe('padStart', () => {
    it('Can add leading characters', async () => {
      expect(padStart('world!', 12, 'hello ')).toBe('hello world!');
    });
  });

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
});
