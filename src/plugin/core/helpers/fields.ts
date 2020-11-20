import { ValidationRuleSchema, FormilySchemas, RuleSchema, FormilyElements, HtmlNameTemplate } from '../types';
import { isNullOrUndefined, each, isCallable, merge, getter, isPlainObject } from '../utils';
import { isEmptyValue } from './validations';

function genProp(obj: any, props: Record<string, any>, key: string, context?: any, ...args: any[]) {
  const property = Object.getOwnPropertyDescriptor(props, key);
  const _getter = property && property.get;

  getter(
    obj,
    key,
    _getter
      ? _getter
      : (val: any) => {
          if (val !== undefined) {
            return val;
          }
          const value = props[key];

          return isCallable(value) ? value.call(context, ...args) : value;
        }
  );
}

export function genProps(
  properties?: (Record<string, any> | any[] | undefined)[],
  context?: any,
  ...args: any[]
): Record<string, any> | null {
  if (!properties || !properties.length) {
    return null;
  }

  const _props: Record<string, any> = {};

  properties.forEach(props => {
    if (Array.isArray(props)) {
      if (props.length === 2 && typeof props[0] === 'string') {
        genProp(_props, props[1], props[0], context, ...args);
      } else {
        props.forEach(p => {
          if (!Array.isArray(p)) {
            genProps(p, context, ...args);
          }
        });
      }
    } else if (isPlainObject(props)) {
      const keys = Object.keys(props);

      keys.forEach(key => {
        genProp(_props, props, key, context, ...args);
      });
    }
  });

  return !isEmptyValue(_props) ? _props : null;
}

export function traverseFields(path: string | string[] = [], fields: any) {
  if (typeof path === 'string') path = path.split('.');

  const fieldName = path.shift();
  let field = fields.find((f: any) => f.formId === fieldName) || null;

  if (!field || !path.length) {
    return field;
  }

  if ('fields' in field) {
    field = traverseFields(path, field.fields);
  }

  return field;
}

export function cascadeRules(parentRules: Record<string, ValidationRuleSchema>, fields: FormilySchemas[]) {
  if (isNullOrUndefined(parentRules)) {
    return fields;
  }

  return fields.map((fieldSchema: FormilySchemas) => {
    const { rules = {} } = fieldSchema;

    each(parentRules, (parentRule: RuleSchema, key) => {
      const rule = rules[key];

      if (isCallable(parentRule) || !parentRule.cascade || (rule && 'inherit' in rule && rule.inherit === false)) {
        return;
      }

      rules[key] = merge({}, parentRule, rule);
    });

    fieldSchema.rules = rules;

    return fieldSchema;
  });
}

type HtmlNameGenerator = {
  keysGens: Exclude<HtmlNameTemplate['keys'], undefined>[];
  template: Exclude<HtmlNameTemplate['template'], undefined>;
  genName: (formElement: FormilyElements, ancestors: FormilyElements[] | null) => string;
};

const _htmlNameTemplates = new Map<string, HtmlNameGenerator>();

export function getHtmlNameGenerator(key: string) {
  return _htmlNameTemplates.get(key) as HtmlNameGenerator;
}

const defaultKeyGen = (_: any, parentKeys: string[]) => parentKeys;

export function registerHtmlNameGenerator({ formType, keys, template }: HtmlNameTemplate) {
  const gen = getHtmlNameGenerator(formType);
  const keysGens: HtmlNameGenerator['keysGens'] = gen
    ? keys
      ? [keys, ...gen.keysGens]
      : gen.keysGens
    : [defaultKeyGen];
  template = template || gen.template;

  if (!template) {
    throw new Error("Missing 'template' for html name generator");
  }

  _htmlNameTemplates.set(formType, {
    keysGens,
    template,
    genName(formElement: FormilyElements, ancestors: FormilyElements[] | null) {
      const keysPath = ancestors
        ? ancestors
            .map(e => {
              const templ = getHtmlNameGenerator(e.formType);

              return templ.keysGens.reduce(
                (acc: string[], keysGen) => {
                  acc = keysGen(e, acc);
                  return acc;
                },
                [e.formId]
              );
            })
            .flat()
        : [formElement.formId];

      return this.template.call(formElement, keysPath);
    }
  });
}
