import { Form, Field, Group, Collection } from  '@/core/elements';
import { registerElement } from '@/helpers';

[Field, Group, Collection].forEach(F => registerElement(F));

describe('Form', () => {
  const form = new Form({
    formId: 'form',
    formType: 'group',
    fields: [
      {
        formId: 'a',
        formType: 'field',
        type: 'string'
      },
      {
        formId: 'b',
        formType: 'groups',
        group: {
          fields: [
            {
              formId: 'c',
              formType: 'field',
              type: 'string'
            },
            {
              formId: 'd',
              formType: 'groups',
              group: {
                fields: [
                  {
                    formId: 'e',
                    formType: 'field',
                    type: 'string'
                  },
                  {
                    formId: 'f',
                    formType: 'field',
                    type: 'string'
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  });

  it('Field has correct name', () => {
    expect((form.getField('a') as any).htmlName).toBe('form[a]');
    expect((form.getField('b') as any).htmlName).toBe('form[b][]');
  });

  it('Nested form fields has correct name', () => {
    // groups item 1
    const b0 = (form.getField('b') as any).addGroup();

    expect(b0.htmlName).toBe('form[b][0]');
    expect(b0.getField('c').htmlName).toBe('form[b][0][c]');

    const i1d0 = b0.getField('d').addGroup();

    expect(i1d0.htmlName).toBe('form[b][0][d][0]');
    expect(i1d0.getField('e')?.htmlName).toBe('form[b][0][d][0][e]');

    // group item 2
    const b2 = (form.getField('b') as any).addGroup();

    expect(b2.htmlName).toBe('form[b][1]');
    expect(b2.getField('d').htmlName).toBe('form[b][1][d][]');

    const b2d0 = b2.getField('d').addGroup();

    expect(b2d0.htmlName).toBe('form[b][1][d][0]');

    const b2d1 = b2.getField('d').addGroup();
    expect(b2d1.htmlName).toBe('form[b][1][d][1]');
  });
});
