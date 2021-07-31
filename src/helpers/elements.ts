import { Element } from '@/core/elements';
import { ValidationRuleSchema } from '../types';

import { each, isCallable, merge, logMessage, findIndex, isObject, def, isUndefined, picks } from '../utils';

const _Elements: any[] = [];

export function registerElement(F: any, ...args: any[]) {
  if (!_Elements.includes(F)) {
    _Elements.unshift(F);
  }

  F.register(...args);
}

export function unregisterElement(F: any, ...args: any[]) {
  const index = _Elements.indexOf(F);

  if (index > -1) {
    F.unregister(...args);

    _Elements.splice(index, 1);
  }
}

export function genFields(fields: any[], ...args: any[]) {
  const length = _Elements.length;
  let invalidSchema: any;

  if (!length) {
    throw new Error(logMessage('No form elements have been registed yet'));
  }

  return fields.map(schema => {
    for (let i = 0; i < length; i++) {
      const F = _Elements[i];
      const accepted = F.accept(schema);

      if (accepted.valid) {
        return F.create(schema, ...args);
      }

      invalidSchema = schema;
    }

    throw new Error(
      logMessage(
        `Failed to create form elmenent, caused by schema:\n ${JSON.stringify(invalidSchema, null, 2).slice(
          0,
          50
        )}\n\t...\n`
      )
    );
  });
}

export function genProps(properties: any = {}, context?: any, ...args: any[]) {
  if (isObject(properties)) {
    each(properties, (prop: any, key) => {
      if (isObject(prop)) {
        genProps(prop, context, ...args);
      } else if (isCallable(prop)) {
        def(properties, key, {
          get() {
            return prop.call(context, ...args);
          }
        });
      }
    });
  }

  return properties;
}

export function cascadeRules(parentRules: ValidationRuleSchema[], fields: any[]) {
  return parentRules
    ? fields.map(fieldSchema => {
        const { rules } = fieldSchema;

        if (rules) {
          each(parentRules, (parentRule, key) => {
            const index = findIndex(rules, (rule: any) => rule.key === key);
            const rule = rules[index];

            if (isCallable(parentRule) || !parentRule.cascade || (rule && rule.inherit === false)) {
              return;
            }

            rules[index] = merge({}, parentRule, rule);
          });

          fieldSchema.rules = rules;
        }

        return fieldSchema;
      })
    : fields;
}

export function genHtmlName(Element: any, ancestors: any[] | null): string {
  const keysPath = ancestors
    ? ancestors.reduce((acc: string[], fe) => {
        return 'index' in fe ? [...acc, '' + fe.index] : [...acc, fe.formId];
      }, [])
    : [];
  const [root, ...rest] = [...keysPath, 'index' in Element ? '' + Element.index : Element.formId];
  const htmlName = rest ? `${root}[${rest.join('][')}]` : root;

  return Element.type === 'set' ? `${htmlName}[]` : htmlName;
}

export function getProp(element: Element, path: string, options: { up?: boolean } = {}) {
  let prop = picks(path, element.props);
  const parent = element.parent;

  if (options.up && isUndefined(prop) && parent) {
    prop = getProp(parent, path, options);
  }

  return prop;
}
