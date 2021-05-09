import flushPromises from 'flush-promises';
import { Field } from '@/core/elements';
import { numeric, required } from '@/rules';
import { plug } from '@/helpers';
import { DATE_TIME_FORMATTER, STRING_FORMATTER } from '@/constants';
import dateTimeFormatter from '@/plugins/dateTimeFormatter';
import stringFormatter from '@/plugins/stringFormatter';

plug(DATE_TIME_FORMATTER, dateTimeFormatter);
plug(STRING_FORMATTER, stringFormatter);

describe('Field', () => {
  it('Can cast', async () => {
    const f1 = new Field({
      formId: 'field_name',
      type: 'number',
      value: '1'
    });
    const f2 = new Field({
      formId: 'field_name',
      type: 'string',
      value: 123
    });
    const f3 = new Field({
      formId: 'field_name',
      type: 'boolean',
      value: 'true'
    });
    const f4 = new Field({
      formId: 'field_name',
      type: 'date',
      value: '2020/12/3'
    });

    await flushPromises();

    expect(f1.value).toBe(1);
    expect(f2.value).toBe('123');
    expect(f3.value).toBe(true);
    expect(f3.checked).toBe(true);
    expect(f4.value).toBeInstanceOf(Date);

    const date = new Date();

    f1.raw = '3';
    f2.setValue(date);
    f3.raw = 'aaa';
    f4.setValue(date);

    await flushPromises();

    expect(f1.value).toBe(3);
    expect(typeof f2.value).toBe('string');
    expect(f3.value).toBe(false);
    expect(f3.checked).toBe(false);
    expect(f4.value).toBeInstanceOf(Date);

    f1.raw = '3a';
    f4.raw = 'abc'

    await flushPromises();

    expect(f1.value).toBe(null);
    expect(f1.valid).toBe(false);
    expect(f4.value).toBe(null);
    expect(f4.valid).toBe(false);
  })

  it('Can format', async () => {
    const f1 = new Field({
      formId: 'field_name',
      type: 'string',
      format: '{abc} {obj.aaa} {arr[0]} {arr[1].ddd} {field.value} {field.raw}',
      value: 'test',
      props: {
        abc: 12,
        obj: {
          aaa: '123'
        },
        arr: [1, {
          ddd: '2'
        }]
      }
    });
    const f2 = new Field({
      formId: 'field_name',
      type: 'date',
      format: 'yyyy/MM/dd',
      value: '2020-01-21',
    });

    await flushPromises();

    expect(f1.formatted).toBe('12 123 1 2 test test');
    expect(f2.formatted).toBe('2020/01/21');
  });

  it('Can override default rules', async () => {
    const f = new Field({
      formId: 'field_name',
      type: 'number',
    });

    f.validation.addRule({
      ...numeric,
      message: 'test message'
    });

    f.setValue('1a');

    await flushPromises();

    expect(f.value).toBe(null);
    expect(f.valid).toBe(false);
    expect((f.validation as any).numeric.error).toBe('test message');
  });

  it('Can be shaked', async () => {
    const f = new Field({
      formId: 'field_name',
      value: '',
      rules: [
        {
          name: 'test',
          validator: () => false,
          message: 'test message'
        }
      ]
    });

    await flushPromises();

    expect(f.value).toBe(null);
    expect(f.valid).toBe(false);
    expect(f.error).toBe(null);

    f.shake();

    expect(f.error).toBe('test message');
  });

  it('Can reset', async () => {
    const f = new Field({
      formId: 'field_name',
      value: '',
      default: 'test',
      rules: [
        {
          name: 'test',
          validator: () => false,
          message: 'test message'
        }
      ]
    });

    await flushPromises();

    f.shake();

    expect(f.error).toBe('test message');

    f.reset();

    expect(f.error).toBe(null);
    expect(f.validation.errors).toBe(null);
    expect(f.raw).toBe('test');
  });

  it('Can clean up', async () => {
    const f = new Field({
      formId: 'field_name',
      value: '',
      rules: [
        {
          ...required,
          message: 'abc'
        }
      ]
    });

    await flushPromises();

    f.shake();

    expect(f.valid).toBe(false);
    expect(typeof f.error).toBe('string');

    f.cleanUp();

    expect(f.valid).toBe(false);
    expect(f.error).toBe(null);
  });

  it('Can clear', async () => {
    const f = new Field({
      formId: 'field_name',
      value: '',
      rules: [
        {
          ...required,
          message: 'abc'
        }
      ]
    });

    await flushPromises();

    f.shake();

    expect(f.valid).toBe(false);
    expect(typeof f.error).toBe('string');

    await f.clear();

    expect(f.valid).toBe(false);
    expect(f.error).toBe(null);
    expect(f.validation.errors).toBeInstanceOf(Array);
    expect(f.raw).toBe('');
  });

  it('Can invalidate manually', async () => {
    const f = new Field({
      formId: 'field_name',
      value: '',
    });

    f.invalidate();

    expect(f.valid).toBe(false);
    expect(f.error).toBe(null);

    f.invalidate('test');
    f.shake();

    expect(f.valid).toBe(false);
    expect(f.error).toBe('test');

    f.cleanUp();

    expect(f.valid).toBe(true);
    expect(f.error).toBe(null);
  });

  it('Should has checked property', async () => {
    const f = new Field({
      formId: 'field_name',
      checkValue: 'test'
    });

    expect(f.checked).toBe(false);

    f.raw = 'test'

    await flushPromises();

    expect(f.checked).toBe(true);

    const f2 = new Field({
      formId: 'field_name',
      checkValue() {
        return 'test'
      }
    });

    expect(f2.checked).toBe(false);

    f2.raw = 'test'

    await flushPromises();

    expect(f2.checked).toBe(true);
  });
});
