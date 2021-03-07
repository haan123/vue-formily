import { ElementConstructor, ValidationRuleSchema } from '../types';

import { each, isCallable, merge, isPlainObject, isEmpty, logMessage, valueOrNull, isString, getter } from '../utils';

const _Elements: ElementConstructor[] = [];

export function registerElement(F: ElementConstructor) {
  if (!_Elements.includes(F)) {
    _Elements.unshift(F);
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

function genProp(obj: any, props: Record<string, any>, key: string, context?: any, ...args: any[]) {
  const property = Object.getOwnPropertyDescriptor(props, key);
  const _getter = property && property.get;

  getter(
    obj,
    key,
    _getter
      ? _getter
      : () => {
          const value = props[key];

          return isCallable(value) ? value.call(context, ...args) : value;
        }
  );

  return obj;
}

export function genProps(
  properties: (Record<string, any> | any[] | undefined)[],
  context?: any,
  ...args: any[]
): Record<string, any> | null {
  if (isEmpty(properties)) {
    return null;
  }

  const _props: Record<string, any> = {};

  properties.forEach(props => {
    if (Array.isArray(props)) {
      if (props.length === 2 && isString(props[0])) {
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
        genProp(_props || {}, props, key, context, ...args);
      });
    }
  });

  return !isEmpty(_props) ? _props : null;
}

export function traverseFields(path: string | string[] = [], fields: any) {
  if (isString(path)) path = path.split('.');

  const fieldName = path.shift();
  let field = fields.find((f: any) => f.formId === fieldName);

  if (!field || !path.length) {
    return valueOrNull(field);
  }

  if ('fields' in field) {
    field = traverseFields(path, field.fields);
  }

  return field;
}

export function cascadeRules(parentRules: ValidationRuleSchema[], fields: any[]) {
  return parentRules ? fields.map(fieldSchema => {
    const { rules = {} } = fieldSchema;

    each(parentRules, (parentRule, key) => {
      const rule = rules[key];

      if (isCallable(parentRule) || !parentRule.cascade || (rule && rule.inherit === false)) {
        return;
      }

      rules[key] = merge({}, parentRule, rule);
    });

    fieldSchema.rules = rules;

    return fieldSchema;
  }) : fields;
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
