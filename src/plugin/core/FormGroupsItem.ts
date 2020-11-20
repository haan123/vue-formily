import { FormGroupSchema, FormContainer, FormilyElements } from './types';
import FormGroup from './FormGroup';
import { registerHtmlNameGenerator } from './helpers';
import { FORM_TYPE_GROUP } from './constants';

registerHtmlNameGenerator({
  formType: FORM_TYPE_GROUP,
  keys(formElement: FormilyElements, parentKeys: string[]) {
    return ['' + (formElement as FormGroupsItem).index, ...parentKeys];
  }
});

export default class FormGroupsItem extends FormGroup {
  index: number;

  constructor(schema: FormGroupSchema, parent: FormContainer | null = null, index: number) {
    super(schema, parent);

    this.index = index;
  }
}
