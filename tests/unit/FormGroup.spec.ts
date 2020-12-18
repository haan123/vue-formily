import { Group } from '@/core/elements';

describe('Group', () => {
  // const field = new Group({
  //   formId: 'field_name',
  //   formType: 'group',
  //   fields: [

  //   ]
  // });

  const schema: any = { formId: 'group_test' }

  it('Throw error with invalid `formType`', () => {
    expect(function() {
      schema.formType = 'abc';
      new Group(schema)
    }).toThrowError('Invalid schema, \'formType\' must be \'group\'');
  });

  it('Throw error with undefined `fields`', () => {
    schema.formType = 'group';

    expect(function() {
      new Group(schema)
    }).toThrowError('Invalid schema, \'fields\' is empty or missing');
  });

  it('Throw error with empty `fields`', () => {
    expect(function() {
      schema.fields = [];
      new Group(schema)
    }).toThrowError('Invalid schema, \'fields\' is empty or missing');
  });
});
