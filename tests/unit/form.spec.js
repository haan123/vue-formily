import Form from '@/plugin/core/Form';

describe('Form', () => {
  const form = new Form({
    formId: 'form',
    fields: [
      {
        formId: 'a',
        type: 'string'
      },
      {
        formId: 'b',
        type: 'groups',
        fields: [
          {
            formId: 'c',
            type: 'string'
          },
          {
            formId: 'd',
            type: 'groups',
            fields: [
              {
                formId: 'e',
                type: 'string'
              },
              {
                formId: 'f',
                type: 'string'
              }
            ]
          }
        ]
      }
    ]
  });

  it('Throw error when missing "formId" in schema', () => {
    expect(() => {
      new Form({});
    }).toThrowError('Missing "formId"');
  });

  it('Throw error when missing "fields" in schema', () => {
    expect(() => {
      new Form({ formId: 'abc' });
    }).toThrowError('Missing "fields"');
  });

  it('Form field has correct name', () => {
    expect(form.getField('a').htmlName).toBe('a');
    expect(form.getField('b').htmlName).toBe('b[]');
  });

  it('Nested form fields has correct name', () => {
    const b = form.getField('b');

    b.addGroup();
    const bg0 = b.groups[0];
    expect(bg0.htmlName).toBe('b[0]');
    expect(bg0.getField('c').htmlName).toBe('b[0][c]');

    const d0 = bg0.getField('d');
    d0.addGroup();
    expect(d0.groups[0].htmlName).toBe('b[0][d][0]');
    expect(d0.groups[0].getField('e')?.htmlName).toBe('b[0][d][0][e]');

    b.addGroup();
    const bg1 = b.groups[1];
    expect(bg1.htmlName).toBe('b[1]');
    expect(bg1.getField('d').htmlName).toBe('b[1][d]');

    const d1 = bg1.getField('d');
    d1.addGroup();
    expect(d1.groups[1].htmlName).toBe('b[1][d][0]');
    d1.addGroup();
    expect(d1.groups[1].htmlName).toBe('b[1][d][1]');
  });
});
