import { ValidationResult } from '../validations/types';
import { ElementData, FieldSchema, FieldType, FieldValue } from './types';

import Element from './Element';
import { def, logMessage, isCallable, setter, ref, Ref, isNumber, isEmpty } from '../../utils';
import Validation, { ExtValidation } from '../validations/Validation';
import { normalizeRules, indentifySchema, invalidateSchemaValidation, genHtmlName } from '../../helpers';
import { reactiveGetter } from '../Objeto';
import { numeric } from '../../rules';
import { Rule } from '../validations';

type FieldValidationResult = ValidationResult & {
  value: FieldValue;
};

type FieldData = ElementData & {
  error: string | null;
  raw: Ref<any>;
  typed: Ref<FieldValue>;
};

let _privateData: FieldData;

const dumpRule = new Rule(() => true);

const typing = {
  string: {
    cast(value: any) {
      return value !== null ? '' + value : null;
    }
  },
  number: {
    rule: new Rule(numeric),
    cast(value: any) {
      return +value;
    }
  },
  boolean: {
    cast(value: any) {
      return value === true || value === 'true' ? true : false;
    }
  },
  date: {
    cast(value: any) {
      return new Date(value);
    }
  }
}

function formatter(value: any): string { return value }

export default class Field extends Element {
  static FORM_TYPE = 'field';
  static FIELD_TYPE_STRING = 'string';
  static FIELD_TYPE_NUMBER = 'number';
  static FIELD_TYPE_BOOLEAN = 'boolean';
  static FIELD_TYPE_DATE = 'date';

  static accept(schema: any) {
    const type: FieldType = (Field as any)[`FIELD_TYPE_${schema.type && schema.type.toUpperCase()}`];

    const { identified, sv } = indentifySchema(schema, type);

    if (!identified) {
      if (!type) {
        invalidateSchemaValidation(sv, `type '${schema.type}' is not supported`, {
          formId: schema.formId
        });
      }

      if (sv.valid) {
        schema.__is__ = type;
      }
    }

    return sv;
  }

  static create(schema: FieldSchema, parent?: Element): Field {
    return new Field(schema, parent);
  }

  readonly formType!: string;
  readonly type!: FieldType;
  readonly inputType!: string;
  readonly default!: any;
  readonly formatted!: string | null;
  readonly error!: string | null;
  readonly checked!: boolean;
  readonly validation!: Validation;
  pending = false;
  raw!: string;
  value!: FieldValue;

  constructor(schema: FieldSchema, parent?: Element) {
    super(schema, parent);

    const accepted = Field.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`[Schema error] ${accepted.reason}`, accepted.infos));
    }

    const { type, rules, inputType = 'text' } = schema;

    def(this, 'formType', Field.FORM_TYPE, { writable: false });
    def(this, 'type', type, { writable: false });
    def(this, 'inputType', inputType, { writable: false });

    def(this, 'validation', new Validation(normalizeRules(rules, this.props, this.type, this, { field: this })), { writable: false });

    const hasDefault = 'default' in schema;
    def(this, 'default', hasDefault ? schema.default : null, { writable: false });

    const format = isCallable(schema.format) ? schema.format : formatter;

    const formatted = ref(format.call(this, this.default));
    const raw = ref(hasDefault ? this.default : '');
    const typed = ref(null);

    setter(this, 'value', typed, (val: any) => {
      raw.value = '' + val;

      this.validate(raw.value).then(({ value }) => {
        typed.value = value;
        formatted.value = format.call(this, typed.value);
      });
    });

    setter(this, 'raw', raw, (val: any) => {
      this.value = val;
    });

    reactiveGetter(this, 'formatted', formatted);
    reactiveGetter(this, 'error', _privateData.error);
    reactiveGetter(this, 'checked', () => this.value === true);

    _privateData.raw = raw;
    _privateData.typed = typed;
  }

  isValid() {
    return !_privateData.invalidated && !this.validation.valid;
  }

  invalidate(error?: string) {
    _privateData.invalidated = true;
    _privateData.error = error ? error : this.validation.errors[0] || null;
  }

  reset() {
    _privateData.error = null;
    _privateData.raw.value = this.default;
    _privateData.typed.value = null;

    this.validation.reset();
  }

  _initialize(schema: FieldSchema, parent: any, data: ElementData) {
    _privateData = data as FieldData;
  }

  getHtmlName(): string {
    return genHtmlName(this, _privateData.ancestors);
  }

  async validate(val: any): Promise<FieldValidationResult> {
    let value: FieldValue = null;
    const typi = typing[this.type];
    let castingRule: Rule = dumpRule;
    let typed = null;

    this.pending = true;

    if ('rule' in typi) {
      castingRule = (this.validation as ExtValidation<any>)[typi.rule.name] || typi.rule;
    }

    const result = await castingRule.validate(val);

    if (result.valid) {
      typed = typi.cast(val);
      await this.validation.validate(typed, { excluded: [castingRule.name] });
    }

    const { valid, errors } = this.validation;

    if (!valid) {
      value = null;
    }

    this.pending = false;

    return {
      errors,
      valid,
      value
    };
  }
}
