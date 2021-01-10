import flushPromises from 'flush-promises';
import { Rule } from '@/core/validations';
import { numeric } from '@/rules';

describe('Rule', () => {
  const validation = new Rule(numeric);

  it('Validate successfully', async () => {
    expect((await validation.validate(4)).error).toBe(null);
    expect(typeof (await validation.validate('4a')).error).toBe('string');
  });
});
