import flushPromises from 'flush-promises';
import { Field } from '@/core/elements';
import { numeric } from '@/rules';

describe('Field', () => {
  const field = new Field({
    formId: 'field_name',
    type: 'number'
  });

  it('Should invalidated with wrong `typed value` entered', async () => {
    field.value = '1a';

    await flushPromises();

    expect(field.value).toBe(null);
    expect(field.valid).toBe(false);
  });

  it('Should use custom numeric rule when field type is number', async () => {
    field.validation.addRule(numeric);

    field.value = '1a';

    await flushPromises();

    expect(field.value).toBe(null);
    expect(field.valid).toBe(false);
    expect((field.validation as any).numeric.valid).toBe(false);
    expect((field.validation as any).numeric.error).toBe(null);
  });
});
