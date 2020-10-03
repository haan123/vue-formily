import FormField from '@/plugin/core/FormField';

describe('HelloWorld.vue', () => {
  const field = new FormField({
    formId: 'field_name',
    type: 'string'
  });

  it('Throw error when value type does not match with field type', () => {
    expect(function() {
      field.value = 1;
    }).toThrowError('Value has to be a "string" but got "number"');
  });
});
