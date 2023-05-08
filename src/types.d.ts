import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  PropsWithChildren,
} from 'react';

type Primitive = string | number | boolean;
type PrimitiveRecord = Record<string, Primitive>;

type ControlledTextField = {
  value: string;
  id: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
type ControlledNumberField = {
  value: number;
  id: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
type ControlledBooleanField = {
  checked: boolean;
  id: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type ControlledMultiOption<P extends Primitive> = {
  label: string;
  value: P;
};
type ControlledMultiOptionSelect<P extends Primitive> = {
  selected: boolean;
} & ControlledMultiOption<P>;
type ControlledMultiOptionRadio<P extends Primitive> = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
} & ControlledMultiOption<P>;

type ControlledTextSelectField = ControlledTextField & {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};
type ControlledNumberSelectField = ControlledNumberField & {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};
type ControlledTextRadioField = ControlledTextField & {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
type ControlledNumberRadioField = ControlledNumberField & {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type FieldSetters<T> = {
  [K in keyof T]: (next: T[K]) => void;
};

type FormControlAlgo<R extends Primitive> = R extends boolean
  ? ControlledBooleanField
  : R extends number
  ? ControlledNumberField
  : ControlledTextField;

type FormOptionsValidate<T> = Partial<
  Readonly<{
    [K in keyof T]: (value: T[K], values: T) => string | undefined;
  }>
>;
type FormOptionsFieldProps<T extends PrimitiveRecord> = Partial<{
  [K in keyof T as string & keyof T]: Partial<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  >;
}>;

// FORM OPTIONS
type HTMLOptions<T extends PrimitiveRecord> = Partial<{
  [K in keyof T]: Partial<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  >;
}>;

export type CreateFormOptions<T extends PrimitiveRecord> = {
  validate?: FormOptionsValidate<T>;
  props?: HTMLOptions<T>;
};
type ControlledOptions<T extends PrimitiveRecord> = {
  validate: FormOptionsValidate<T>;
  props: HTMLOptions<T>;
};

export type CreateFormUncontrolledOptions<T extends PrimitiveRecord> = {
  props?: HTMLOptions<T>;
};
type UncontrolledOptions<T extends PrimitiveRecord> = {
  props: HTMLOptions<T>;
};
// END FORM OPTIONS

type FormFields<T extends PrimitiveRecord> = {
  [K in keyof T]: FormControlAlgo<T[K]>;
};

type FormContextErrors<T extends PrimitiveRecord> = {
  errors: {
    [K in keyof T]: string | undefined;
  };
};
type FormContextFiles<T> = Partial<{
  [K in keyof T]: FileList | null;
}>;
type FormContextToJSON<T> = {
  toJSON: () => T;
};
type FormContext<T extends PrimitiveRecord> = FormContextErrors<T> &
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

type CreateFormProviderProps<T extends PrimitiveRecord = {}> =
  PropsWithChildren<{ defaultValues: T }>;
type CreateForm<T extends PrimitiveRecord> = {
  Context: React.Context<FormContext<T>>;
  Provider: (props: CreateFormProviderProps<T>) => JSX.Element;
};
type CreateFormUncontrolled<T extends PrimitiveRecord> = {
  Context: React.Context<FormContextUncontrolled<T>>;
  Provider: (props: CreateFormProviderProps<T>) => JSX.Element;
};

/**
 * UNCONTROLLED TYPES
 */
type FormContextUncontrolled<T extends PrimitiveRecord> = {
  options: UncontrolledOptions<T>;
} & FormFieldsUncontrolled<T>;

type UncontrolledTextField = {
  defaultValue: string;
  id: string;
  name: string;
};
type UncontrolledNumberField = {
  defaultValue: number;
  id: string;
  name: string;
};
type UncontrolledBooleanField = {
  defaultChecked: boolean;
  id: string;
  name: string;
};
type FormUncontrolAlgo<R extends Primitive> = R extends boolean
  ? UncontrolledBooleanField
  : R extends number
  ? UncontrolledNumberField
  : UncontrolledTextField;
type FormFieldsUncontrolled<T extends PrimitiveRecord> = {
  [K in keyof T]: FormUncontrolAlgo<T[K]>;
};
