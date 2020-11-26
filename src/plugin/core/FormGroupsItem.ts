import { FormGroupSchema, FormGroups } from './types';
import FormGroup from './FormGroup';
import { getter } from './utils';

export default class FormGroupsItem extends FormGroup {
  index!: number;

  constructor(schema: FormGroupSchema, parent: any, ...args: any[]) {
    super(schema, parent, ...args);

    getter(this, 'index', () => {
      const { groups } = this.parent as FormGroups;

      return groups?.findIndex(group => group === this);
    });
  }
}
