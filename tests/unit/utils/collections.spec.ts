import { merge } from '../../../src/utils/collections'

describe('collections utils', () => {
  describe('merge', () => {
    it('Can merge with normal object', async () => {
      const obj = merge({ a: 1 }, {
        b: 1,
        c: {
          d: 2
        }
      });

      expect(obj.a).toBe(1);
      expect(obj.b).toBe(1);
      expect(obj.c.d).toBe(2);
    });

    it('Can merge with object has accessors', async () => {
      let i = 0;

      const obj = merge({ a: 1 }, {
        get b () {
          return i++;
        },
        c: {
          get d () {
            return i;
          }
        }
      });

      expect(obj.b).toBe(1);
      expect(obj.b).toBe(2);
      expect(obj.c.d).toBe(3);
    });
  });

  // describe('pick', () => {
  //   const sample = {
  //     a: 1,
  //     b: {
  //       c: 2
  //     }
  //   };

  //   it('Can pick with string', async () => {
  //     expect(pick(sample, 'a')).toBe(1);
  //     expect(pick(sample, 'b.c')).toBe(2);
  //     expect(pick(sample, 'd')).toBe(undefined);
  //     expect(pick(sample, 'd.e')).toBe(undefined);
  //   });

  //   it('Can pick with array', async () => {
  //     expect(pick(sample, ['a'])).toBe(1);
  //     expect(pick(sample, ['b', 'c'])).toBe(2);
  //     expect(pick(sample, ['d'])).toBe(undefined);
  //     expect(pick(sample, ['d', 'e'])).toBe(undefined);
  //   });
  // });
});
