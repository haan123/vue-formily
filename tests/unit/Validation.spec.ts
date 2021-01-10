import flushPromises from 'flush-promises';
import { Rule, Validation } from '@/core/validations';
import { numeric } from '@/rules';
import { ExtValidation } from '@/core/validations/Validation';

describe('Validation', () => {
  const validation = new Validation([
    numeric
  ]) as ExtValidation<'numeric'>;

  it('Can access rule from index signature', () => {
    expect(validation).toHaveProperty('numeric');
    expect(validation.numeric).toBeInstanceOf(Rule);
  });
});
