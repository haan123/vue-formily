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

  it('Should cast to correct value type', async () => {
    const f1 = new Field({
      formId: 'field_name',
      type: 'number'
    });

    f1.raw = '1';

    const f2 = new Field({
      formId: 'field_name',
      type: 'boolean'
    });

    f2.raw = 'true';

    const f3 = new Field({
      formId: 'field_name',
      type: 'date'
    });

    f3.raw = 'abc';

    await flushPromises();

    expect(f1.value).toBe(1);
    expect(f2.value).toBe(true);

    f2.raw = 'a';

    await flushPromises();

    expect(f2.value).toBe(false);
    expect(f3.value).toBeInstanceOf(Date);
  });
});
