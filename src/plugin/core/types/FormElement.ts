import { FormContainer, FormilyElements, FormilySchemas, Validation, ValidationRuleSchema } from '.';

export type FormElementData = {
  ancestors: FormilyElements[] | null;
  invalidated: boolean;
};

export type FormElementSchema = {
  readonly formId: string;
  rules?: Record<string, ValidationRuleSchema>;
  model?: string;
};

export declare abstract class FormElement {
  constructor(schema: FormilySchemas, parent: FormContainer | null, ...args: any[]);

  abstract getHtmlName(): string | null;
  abstract isValid(): boolean;
  abstract initialize(
    schema: FormilySchemas,
    parent: FormContainer | null,
    data: FormElementData,
    ...args: any[]
  ): void;

  readonly _uid: number;
  readonly model: string;
  readonly parent: FormContainer | null;
  readonly formId: string;
  readonly htmlName: string;
  readonly valid: boolean;
  validation: Validation;

  invalidated(): boolean;
  invalidate(error?: string): void;
}
