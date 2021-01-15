import flushPromises from 'flush-promises';
import { Rule } from '@/core/validations';
import { numeric } from '@/rules';

describe('Rule', () => {
  const validation = new Rule(numeric);

  it('Instantiate successfully with validator', async () => {
    const rule = new Rule(() => true);

    expect(rule).toBeInstanceOf(Rule);
    expect((await rule.validate('')).error).toBe(null);
  });

  it('Instantiate successfully with rule instance', async () => {
    const rule = new Rule(validation);
    expect(rule).toBeInstanceOf(Rule);
    expect((await validation.validate(4)).error).toBe(null);
    expect(typeof (await validation.validate('4a')).error).toBe('string');
  });

  it('Validate successfully', async () => {
    expect((await validation.validate(4)).error).toBe(null);
    expect(typeof (await validation.validate('4a')).error).toBe('string');
  });
});
