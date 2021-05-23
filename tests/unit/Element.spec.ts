import { Element } from '@/core/elements';

describe('Element', () => {
  class A extends Element {
    isValid() {
      return true;
    }

    getHtmlName() {
      return '';
    }
  }

  it('Throw error with undefined `formId`', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new A({} as any);
    }).toThrowError('"formId" can not be null or undefined');
  });
});
