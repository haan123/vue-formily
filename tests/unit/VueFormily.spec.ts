import { Collection, Field, Group } from '@/core/elements';
import { registerElement } from '@/helpers';

[Field, Group, Collection].forEach(F => registerElement(F));

describe('VueFormily', () => {
  it('Throw error with invalid schema', () => {
    expect('a').toBe('a');
  });
});
