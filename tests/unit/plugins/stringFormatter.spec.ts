import stringFormatter from "@/plugins/stringFormatter";

describe('stringFormatter', () => {
  it('Should format object as bracket correctly', async () => {
    expect(stringFormatter('{a[b]} {a[c][d]} {value} test', {
      value: 1,
      a: {
        b: 'test',
        c: {
          d: 'aaa'
        }
      }
    })).toBe('test aaa 1 test');
  });

  it('Should format object as dot correctly', async () => {
    expect(stringFormatter('{a.b} {a.c.d} {value} test', {
      value: 1,
      a: {
        b: 'test',
        c: {
          d: 'aaa'
        }
      }
    })).toBe('test aaa 1 test');
  });

  it('Should format object as mixed dot and bracket correctly', async () => {
    expect(stringFormatter('{a.b} {a.c[d]} {a.d[2]} {value} test', {
      value: 1,
      a: {
        b: 'test',
        c: {
          d: 'aaa'
        },
        d: [1, 2, 3]
      }
    })).toBe('test aaa 3 1 test');
  });
});
