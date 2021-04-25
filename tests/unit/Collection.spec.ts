import { Collection, Field, Group } from '@/core/elements';
import { CollectionItem } from '@/core/elements/Collection';
import { FieldSchema, GroupSchema } from '@/core/elements/types';
import { registerElement } from '@/helpers';
import { required } from '@/rules';
import flushPromises from 'flush-promises';

[Field, Group, Collection].forEach(F => registerElement(F));

describe('Group', () => {
  const schema: any = { formId: 'collection_test' }

  it('Throw error with invalid schema', () => {
    expect(function () {
      new Collection(schema)
    }).toThrowError('invalid schema, \'group\' is empty or missing');

    expect(function () {
      schema.group = {};
      new Collection(schema)
    }).toThrowError('invalid schema.group, \'fields\' is empty or missing');
  });

  it('Can add group', async () => {
    schema.rules = [
      {
        ...required,
        message: 'test'
      }
    ];

    schema.group = {
      fields: [
        {
          formId: 'a',
          rules: [
            {
              ...required,
              message: 'abc'
            }
          ]
        }
      ]
    };

    const collection = new Collection(schema);

    expect(collection.groups).toBe(null);

    collection.addGroup();

    expect(collection.groups?.length).toBe(1);

    await collection.addGroup({
      a: 'test'
    });

    expect(collection.groups?.length).toBe(2);
    expect((collection.groups as any)[1].a).toBeInstanceOf(Field);
    expect((collection.groups as any)[1].a.value).toBe('test');
  });

  it('Can validate', async () => {
    const collection = new Collection(schema);

    collection.addGroup();

    await collection.validate();

    collection.shake();

    expect(collection.valid).toBe(false);
    expect(collection.error).toBe(null);
    expect((collection.groups as any)[0].a.error).toBe('abc');

    collection.reset();
    await collection.validate({ cascade: false })

    collection.shake();

    expect(collection.valid).toBe(false);
    expect(collection.error).toBe('test');
    expect((collection.groups as any)[0].valid).toBe(true);
  });

  // it('Can shake', async () => {
  //   const group = new Group(schema);

  //   await group.validate()

  //   group.shake();

  //   expect(group.valid).toBe(false);
  //   expect(group.error).toBe('test');
  //   expect(group.a.error).toBe('abc');

  //   group.reset();

  //   await group.validate()

  //   group.shake({ cascade: false });

  //   expect(group.valid).toBe(false);
  //   expect(group.error).toBe('test');
  //   expect(group.a.error).toBe(null);
  // });

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

  //   group.a.shake();

  //   expect(group.a.valid).toBe(false);
  //   expect(group.a.error).toBe('abc');

  //   group.reset();

  //   expect(group.valid).toBe(true);
  //   expect(group.a.valid).toBe(true);
  // });

  // it('Can invalidate', () => {
  //   const group = new Group(schema);

  //   group.invalidate();

  //   expect(group.valid).toBe(false);
  //   expect(group.error).toBe(null);

  //   group.reset();
  //   group.invalidate('test');
  //   group.shake();

  //   expect(group.valid).toBe(false);
  //   expect(group.error).toBe('test');
  // });

  // it('Can set value', async () => {
  //   schema.fields.push({
  //     formId: 'b',
  //     fields: [
  //       {
  //         formId: 'c',
  //       }
  //     ]
  //   } as GroupSchema);

  //   const group = new Group(schema);

  //   expect(group.value).toBe(null);
  //   expect(group.setValue('test' as any)).rejects.toThrowError();

  //   await group.setValue({
  //     a: 'test',
  //     b: {
  //       c: 'abc'
  //     }
  //   })

  //   expect(group.value).toEqual({
  //     a: 'test',
  //     b: {
  //       c: 'abc'
  //     }
  //   });
  //   expect(group.a.value).toBe('test');
  //   expect(group.b.c.value).toBe('abc');
  // });

  // it('Can clear', async () => {
  //   const group = new Group(schema);

  //   await group.validate();

  //   group.a.shake();

  //   expect(group.a.valid).toBe(false);
  //   expect(group.a.error).toBe('abc');

  //   group.clear();

  //   expect(group.valid).toBe(false);
  //   expect(group.value).toBe(null);
  //   expect(group.a.raw).toBe('');
  //   expect(group.a.value).toBe(null);
  // });
});
