import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  PropsWithChildren,
} from 'react';

export type Primitive = string | number | boolean;
export type PrimitiveRecord = Record<string, Primitive>;

export type ControlledTextField = {
  value: string;
  id: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
export type ControlledNumberField = {
  value: number;
  id: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
export type ControlledBooleanField = {
  checked: boolean;
  id: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type ControlledMultiOption<P extends Primitive> = {
  label: string;
  value: P;
};
export type ControlledMultiOptionSelect<P extends Primitive> = {
  selected: boolean;
} & ControlledMultiOption<P>;
export type ControlledMultiOptionRadio<P extends Primitive> = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
} & ControlledMultiOption<P>;

export type ControlledTextSelectField = ControlledTextField & {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};
export type ControlledNumberSelectField = ControlledNumberField & {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};
export type ControlledTextRadioField = ControlledTextField & {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
export type ControlledNumberRadioField = ControlledNumberField & {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type FieldSetters<T> = {
  [K in keyof T]: (next: T[K]) => void;
};

export type FormControlAlgo<R extends Primitive> = R extends boolean
  ? ControlledBooleanField
  : R extends number
  ? ControlledNumberField
  : ControlledTextField;

export type FormOptionsValidate<T> = Partial<
  Readonly<{
    [K in keyof T]: (value: T[K], values: T) => string | undefined;
  }>
>;
export type FormOptionsFieldProps<T extends PrimitiveRecord> = Partial<{
  [K in keyof T as string & keyof T]: Partial<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  >;
}>;

// FORM OPTIONS
export type HTMLOptions<T extends PrimitiveRecord> = Partial<{
  [K in keyof T]: Partial<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  >;
}>;

export type CreateFormOptions<T extends PrimitiveRecord> = {
  validate?: FormOptionsValidate<T>;
  props?: HTMLOptions<T>;
};
export type ControlledOptions<T extends PrimitiveRecord> = {
  validate: FormOptionsValidate<T>;
  props: HTMLOptions<T>;
};

export type CreateFormUncontrolledOptions<T extends PrimitiveRecord> = {
  props?: HTMLOptions<T>;
};
export type UncontrolledOptions<T extends PrimitiveRecord> = {
  props: HTMLOptions<T>;
};
// END FORM OPTIONS

export type FormFields<T extends PrimitiveRecord> = {
  [K in keyof T]: FormControlAlgo<T[K]>;
};

export type FormContextErrors<T extends PrimitiveRecord> = {
  errors: {
    [K in keyof T]: string | undefined;
  };
};
export type FormContextFiles<T> = Partial<{
  [K in keyof T]: FileList | null;
}>;
export type FormContextToJSON<T> = {
  toJSON: () => T;
};
export type FormContext<T extends PrimitiveRecord> = FormContextErrors<T> &
  FormContextToJSON<T> & {
    validateAll: () => Promise<FormContextErrors<T>['errors']>;
  } & {
    setError: (key: keyof T, error?: string | undefined) => void;
  } & {
    reset: (key: keyof T) => void;
  } & {
    resetAll: () => void;
  } & {
    toFormData: () => FormData;
  } & {
    handleFileEvent: (
      key: keyof T,
    ) => (event: ChangeEvent<HTMLInputElement>) => void;
  } & {
    getFiles: (key: keyof T) => FileList | null;
  } & {
    setters: FieldSetters<T>;
  } & {
    options: ControlledOptions<T>;
  } & FormFields<T>;

export type CreateFormProviderProps<T extends PrimitiveRecord = {}> =
  PropsWithChildren<{ defaultValues: T }>;
export type CreateForm<T extends PrimitiveRecord> = {
  Context: React.Context<FormContext<T>>;
  Provider: (props: CreateFormProviderProps<T>) => JSX.Element;
};
export type CreateFormUncontrolled<T extends PrimitiveRecord> = {
  Context: React.Context<FormContextUncontrolled<T>>;
  Provider: (props: CreateFormProviderProps<T>) => JSX.Element;
};

/**
 * UNCONTROLLED TYPES
 */
export type FormContextUncontrolled<T extends PrimitiveRecord> = {
  options: UncontrolledOptions<T>;
} & FormFieldsUncontrolled<T>;

export type UncontrolledTextField = {
  defaultValue: string;
  id: string;
  name: string;
};
export type UncontrolledNumberField = {
  defaultValue: number;
  id: string;
  name: string;
};
export type UncontrolledBooleanField = {
  defaultChecked: boolean;
  id: string;
  name: string;
};
export type FormUncontrolAlgo<R extends Primitive> = R extends boolean
  ? UncontrolledBooleanField
  : R extends number
  ? UncontrolledNumberField
  : UncontrolledTextField;
export type FormFieldsUncontrolled<T extends PrimitiveRecord> = {
  [K in keyof T]: FormUncontrolAlgo<T[K]>;
};

export type RequiredOptions<P extends Primitive> = {
  value: P;
  label: string;
};
