import flushPromises from 'flush-promises';
import { Field } from '@/core/elements';
import { numeric } from '@/rules';
import { plug } from '@/helpers';
import { DATE_TIME_FORMATTER, STRING_FORMATTER } from '@/constants';
import dateTimeFormatter from '@/plugins/dateTimeFormatter';
import stringFormatter from '@/plugins/stringFormatter';

plug(DATE_TIME_FORMATTER, dateTimeFormatter);
plug(STRING_FORMATTER, stringFormatter);

describe('Field', () => {
  const field = new Field({
    formId: 'field_name',
    type: 'number',
  });

  // it('Can format', async () => {
  //   const schema = {
  //     formId: 'field_name',
  //     value: 'test',
  //   }

  //   let f = new Field({
  //     ...schema,
  //     type: 'string',
  //     format: '{abc} {obj.aaa} {arr[0]} {arr[1].ddd} {field.value} {field.raw}',
  //     props: {
  //       abc: 12,
  //       obj: {
  //         aaa: '123'
  //       },
  //       arr: [1, {
  //         ddd: '2'
  //       }]
  //     }
  //   });

  //   await flushPromises();

  //   expect(f.formatted).toBe('12 123 1 2 test test');

  //   f = new Field({
  //     ...schema,
  //     type: 'date',
  //     format: 'yyyy/MM/dd',
  //     value: '2020-01-21',
  //   });

  //   await flushPromises();

  //   expect(f.formatted).toBe('2020/01/21');
  // });

  it('Should invalidated with wrong `typed value` entered', async () => {
    field.raw = '1a';

    await flushPromises();

    expect(field.value).toBe(null);
    expect(field.valid).toBe(false);
  });

  // it('Should use custom numeric rule when field type is number', async () => {
  //   field.validation.addRule({
  //     ...numeric,
  //     message: 'test message'
  //   });

  //   field.value = '1a';

  //   await flushPromises();

  //   expect(field.value).toBe(null);
  //   expect(field.valid).toBe(false);
  //   expect((field.validation as any).numeric.valid).toBe(false);
  //   expect((field.validation as any).numeric.error).toBe(null);
  // });

  // it('Should cast to correct value type', async () => {
  //   const f1 = new Field({
  //     formId: 'field_name',
  //     type: 'number'
  //   });

  //   f1.raw = '1';

  //   const f2 = new Field({
  //     formId: 'field_name',
  //     type: 'boolean'
  //   });

  //   f2.raw = 'true';

  //   const f3 = new Field({
  //     formId: 'field_name',
  //     type: 'date'
  //   });

  //   f3.raw = 'abc';

  //   await flushPromises();

  //   expect(f1.value).toBe(1);
  //   expect(f2.value).toBe(true);

  //   f2.raw = 'a';

  //   await flushPromises();

  //   expect(f2.value).toBe(false);
  //   expect(f3.value).toBeInstanceOf(Date);
  // });
});
