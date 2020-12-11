import { FormGroupSchema } from './types';

import FormGroup from './FormGroup';
import { getter } from '../../utils';

export default class FormGroupsItem extends FormGroup {
  index!: number;

  constructor(schema: FormGroupSchema, parent: any, ...args: any[]) {
    super(schema, parent, ...args);

    getter(this, 'index', () => {
      const { groups } = this.parent as any;

      return groups?.findIndex((group: any) => group === this);
    });
  }
}
