import { Collection, Field, Group } from '@/core/elements';
import { FieldSchema, GroupSchema } from '@/core/elements/types';
import { registerElement } from '@/helpers';
import { required } from '@/rules';
import flushPromises from 'flush-promises';

[Field, Group, Collection].forEach(F => registerElement(F));

describe('Group', () => {
  // const field = new Group({
  //   formId: 'field_name',
  //   formType: 'group',
  //   fields: [

  //   ]
  // });

  const schema: any = { formId: 'group_test' }

  it('Throw error with undefined `fields`', () => {
    expect(function () {
      new Group(schema)
    }).toThrowError('[Schema error] \'fields\' is empty or missing');
  });

  it('Throw error with empty `fields`', () => {
    expect(function () {
      schema.fields = [];
      new Group(schema)
    }).toThrowError('[Schema error] \'fields\' is empty or missing');
  });

  it('Can access field from index signature', () => {
    schema.fields.push({
      formId: 'a',
      type: 'string'
    } as FieldSchema);

    const group = new Group(schema);

    expect(group).toHaveProperty('a');
    expect(group.a).toBeInstanceOf(Field);
  });

  it('Can set value', async () => {
    schema.fields = [{
      formId: 'a',
      rules: [
        {
          ...required,
          message: 'abc'
        }
      ]
    } as FieldSchema, {
      formId: 'b',
      fields: [
        {
          formId: 'c',
        }
      ]
    } as GroupSchema];

    const group = new Group(schema);

    expect(group.setValue('test' as any)).rejects.toThrowError();

    await group.setValue({
      a: 'test',
      b: {
        c: 'abc'
      }
    })

    expect(JSON.stringify(group.value)).toBe(JSON.stringify({
      a: 'test',
      b: {
        c: 'abc'
      }
    }));
    expect(group.a.value).toBe('test');


  });

  // it('Can reset', async () => {
  //   schema.fields = [{
  //     formId: 'a',
  //     rules: [
  //       {
  //         ...required,
  //         message: 'abc'
  //       }
  //     ]
  //   } as FieldSchema];

  //   const group = new Group(schema);

  //   expect(group.valid).toBe(true);

  //   await flushPromises();

  //   await group.validate();

  //   expect(group.valid).toBe(false);
  //   expect(group.a.error).toBe('abc');
  // });
});
