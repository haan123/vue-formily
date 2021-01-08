import flushPromises from 'flush-promises';
import { Field } from '@/core/elements';

describe('Field', () => {
  const field = new Field({
    formId: 'field_name',
    type: 'number'
  });

  it('Should has `valid=false, value=null` with wrong `typed value` entered', async () => {
    field.value = '1a';

    await flushPromises();

    expect(field.value).toBe(null);
    expect(field.valid).toBe(false);
    expect((field.validation.rules as any).number.valid).toBe(false);
  });
});
