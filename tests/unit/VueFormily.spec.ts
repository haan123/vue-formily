import { createLocalVue, mount } from '@vue/test-utils';
import VueFormily, { Formily } from '../../src';
import { Form } from '@/core/elements';
import { FormSchema } from '@/core/elements/types';
import { VueFormilyOptions } from '@/types';
import flushPromises from 'flush-promises';
import { DATE_TIME_FORMATTER, LOCALIZER, STRING_FORMATTER } from '@/constants';
import { unplug } from '@/helpers';

describe('VueFormily', () => {
  let localVue: any;

  beforeEach(() => {
    localVue = createLocalVue();
  });

  it('Should install successfully', () => {
    localVue.use(VueFormily);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    expect('$formily' in wrapper.vm).toBe(true);
  });

  it('Should add form successfully', () => {
    localVue.use(VueFormily);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const form = ((wrapper.vm as any).$formily as Formily).addForm({
      formId: 'form',
      fields: [
        {
          formId: 'a',
          format: 'test'
        }
      ]
    } as FormSchema);

    expect(form).toBeInstanceOf(Form);
    expect('form' in (wrapper.vm as any).forms).toBe(true);
  });

  it('Can change alias', () => {
    localVue.use(VueFormily, {
      alias: 'myForms'
    });

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    expect('myForms' in wrapper.vm).toBe(true);
  });

  it('Should plug localizer successfully', () => {
    localVue.use(VueFormily, {
      plugins: [
        {
          name: STRING_FORMATTER,
          install() {
            return {
              format(format: any) {
                return format;
              }
            };
          }
        },
        {
          name: LOCALIZER,
          install() {
            return {
              translate(format: any, field: any) {
                return `${format} ${field.value}`;
              }
            };
          }
        }
      ]
    } as VueFormilyOptions);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const form = ((wrapper.vm as any).$formily as Formily).addForm({
      formId: 'form',
      fields: [
        {
          formId: 'a',
          value: 'test',
          format: 'format'
        }
      ]
    } as FormSchema);

    form.on('validated', () => {
      expect(form.a.formatted).toBe('format test');

      unplug(LOCALIZER);
      unplug(STRING_FORMATTER);
    });
  });

  it('Should plug stringFormatter successfully', async () => {
    localVue.use(VueFormily, {
      plugins: [
        {
          name: STRING_FORMATTER,
          install() {
            return {
              format(format: any, field: any) {
                return `${format} ${field.value}`;
              }
            };
          }
        }
      ]
    } as VueFormilyOptions);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const vm = wrapper.vm as any;
    const form = (vm.$formily as Formily).addForm({
      formId: 'form',
      fields: [
        {
          formId: 'a',
          format: 'format',
          value: 'test'
        }
      ]
    } as FormSchema);

    form.on('validated', () => {
      expect(form.a.formatted).toBe('format test');

      unplug(STRING_FORMATTER);
    });
  });

  it('Should plug dateTimeFormatter successfully', async () => {
    localVue.use(VueFormily, {
      plugins: [
        {
          name: DATE_TIME_FORMATTER,
          install() {
            return {
              format(format: any, field: any) {
                return `${format} ${field.value.getFullYear()}`;
              }
            };
          }
        }
      ]
    } as VueFormilyOptions);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const form = ((wrapper.vm as any).$formily as Formily).addForm({
      formId: 'form',
      fields: [
        {
          formId: 'a',
          format: 'format',
          value: '2021/12/01',
          type: 'date'
        }
      ]
    } as FormSchema);

    const mockFn = jest.fn(() => {
      expect(form.a.formatted).toBe('format 2021');
    });

    form.on('validated', mockFn);

    await flushPromises();

    expect(mockFn).toHaveBeenCalled();

    unplug(DATE_TIME_FORMATTER);
  });
});
