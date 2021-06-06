import { createLocalVue, mount } from '@vue/test-utils';
import VueFormily from '@/VueFormily';
import { Collection, Field, Form, Group } from '@/core/elements';
import { registerElement } from '@/helpers';
import { FormSchema } from '@/core/elements/types';
import { VueFormilyOptions } from '@/types';

[Field, Group, Collection].forEach(F => registerElement(F));

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

    expect('$vf' in wrapper.vm).toBe(true);
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

    const form = ((wrapper.vm as any).$vf as VueFormily).addForm({
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
      localizer(value) {
        return `formatted ${value}`;
      }
    } as VueFormilyOptions);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const form = ((wrapper.vm as any).$vf as VueFormily).addForm({
      formId: 'form',
      fields: [
        {
          formId: 'a',
          value: 'test'
        }
      ]
    } as FormSchema);

    form.on('validated', () => {
      expect(form.a.formatted).toBe('formatted test');
    });
  });

  it('Should plug stringFormatter successfully', () => {
    localVue.use(VueFormily, {
      stringFormatter(format, field) {
        return `${format} ${field.value}`;
      }
    } as VueFormilyOptions);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const form = ((wrapper.vm as any).$vf as VueFormily).addForm({
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
    });
  });

  it('Should plug dateTimeFormatter successfully', () => {
    localVue.use(VueFormily, {
      dateTimeFormatter(format, field) {
        return `${format} ${field.value.getFullYear()}`;
      }
    } as VueFormilyOptions);

    const wrapper = mount(
      {
        template: '<div></div>'
      },
      {
        localVue
      }
    );

    const form = ((wrapper.vm as any).$vf as VueFormily).addForm({
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

    form.on('validated', () => {
      expect(form.a.formatted).toBe('format 2021');
    });
  });
});
