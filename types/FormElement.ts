import { FormilyElements, FormilySchemas, Prop, Validation, ValidationRuleSchema } from '.';

export type FormElementData = {
  ancestors: FormilyElements[] | null;
  invalidated: boolean;
};

export type FormElementSchema = {
  readonly formId: PropValue<string>;
  rules?: Record<string, ValidationRuleSchema>;
  model?: string;
};

export declare abstract class FormElement {
  constructor(schema: FormilySchemas, parent: any, ...args: any[]);

  abstract getHtmlName(): string | null;
  abstract isValid(): boolean;
  abstract initialize(schema: FormilySchemas, parent: any, data: FormElementData, ...args: any[]): void;

  readonly _uid: number;
  readonly model: string;
  readonly parent: any;
  readonly formId: string;
  readonly htmlName: string;
  readonly valid: boolean;
  validation: Validation;

  invalidated(): boolean;
  invalidate(error?: string): void;
}
