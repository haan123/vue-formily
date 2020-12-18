import { Element } from '@/core/elements';

describe('Element', () => {
  class A extends Element {
    constructor(schema: any) {
      super(schema)
    }

    initialize() {}
    isValid() { return true; }
    getHtmlName() { return '' }
  }

  it('Throw error with undefined `formId`', () => {
    expect(() => {
      new A({} as any);
    }).toThrowError('"formId" can not be null or undefined');
  });
});
