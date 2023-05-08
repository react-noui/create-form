import { ChangeEvent, useContext, useMemo } from 'react';

import {
  PrimitiveRecord,
  CreateForm,
  ControlledTextField,
  ControlledNumberField,
  ControlledTextSelectField,
  ControlledNumberSelectField,
  ControlledNumberRadioField,
  ControlledTextRadioField,
  Primitive,
  ControlledMultiOptionRadio,
  ControlledMultiOptionSelect,
} from 'types';

type RequiredOptions<P extends Primitive> = {
  value: P;
  label: string;
};

export function useForm<T extends PrimitiveRecord>(form: CreateForm<T>) {
  return useContext(form.Context);
}

export function useFormFileField<T extends PrimitiveRecord>(
  targetForm: CreateForm<T>,
  field: ControlledTextField,
): Omit<ControlledTextField, 'value'> & { type: 'file' } {
  const { handleFileEvent } = useForm(targetForm);
  const { onChange, value, ...fields } = field;
  return useMemo(
    () => ({
      ...fields,
      type: 'file',
      onChange: handleFileEvent(fields.name),
    }),
    [fields, handleFileEvent],
  );
}

type SelectFieldAlgo<
  Field extends ControlledTextField | ControlledNumberField,
> = Field extends ControlledTextField
  ? ControlledTextSelectField
  : Field extends ControlledNumberField
  ? ControlledNumberSelectField
  : never;
export function useFormSelect<
  T extends PrimitiveRecord,
  Field extends ControlledTextField | ControlledNumberField,
>(
  targetForm: CreateForm<T>,
  field: Field,
  options: RequiredOptions<Field['value']>[],
): [SelectFieldAlgo<Field>, ControlledMultiOptionSelect<Field['value']>[]];
export function useFormSelect<
  T extends PrimitiveRecord,
  Field extends ControlledTextField | ControlledNumberField,
>(
  targetForm: CreateForm<T>,
  field: Field,
  options: RequiredOptions<Field['value']>[],
) {
  const form = useForm(targetForm);
  const selectOptions = useFieldOptions(field, options, 'selected');
  const selectField = useMemo(
    () => ({
      ...field,
      onChange: (event: ChangeEvent<HTMLSelectElement>): void => {
        form.setters[field.name](event.target.value as T[typeof field.name]);
      },
    }),
    [form, field],
  );
  return [selectField, selectOptions];
}

type RadioFieldAlgo<Field extends ControlledTextField | ControlledNumberField> =
  Field extends ControlledTextField
    ? ControlledTextRadioField
    : Field extends ControlledNumberField
    ? ControlledNumberRadioField
    : never;
export function useFormRadio<
  T extends PrimitiveRecord,
  Field extends ControlledTextField | ControlledNumberField,
>(
  targetForm: CreateForm<T>,
  field: Field,
  options: RequiredOptions<Field['value']>[],
): [RadioFieldAlgo<Field>, ControlledMultiOptionRadio<Field['value']>[]];
export function useFormRadio<
  T extends PrimitiveRecord,
  Field extends ControlledTextField | ControlledNumberField,
>(
  targetForm: CreateForm<T>,
  field: Field,
  options: RequiredOptions<Field['value']>[],
) {
  const form = useForm(targetForm);
  const radioField = useMemo(
    () => ({
      ...field,
      onChange: (event: ChangeEvent<HTMLSelectElement>): void => {
        form.setters[field.name](event.target.value as T[typeof field.name]);
      },
    }),
    [form, field],
  );
  const radioOptions = useRadioOptions(field, options);
  return [radioField, radioOptions];
}

function useRadioOptions<
  Field extends ControlledTextField | ControlledNumberField,
>(field: Field, options: RequiredOptions<Field['value']>[]) {
  return useMemo(
    () =>
      options.map((option) => ({
        ...option,
        checked: option.value === field.value,
        onChange: field.onChange,
      })),
    [field, options],
  );
}

type FieldOption<Field extends ControlledTextField | ControlledNumberField> = {
  label: string;
  value: Field['value'];
};
type FieldOptionSelect<
  Field extends ControlledTextField | ControlledNumberField,
> = FieldOption<Field> & {
  selected: boolean;
};
type FieldOptionRadio<
  Field extends ControlledTextField | ControlledNumberField,
> = FieldOption<Field> & {
  checked: boolean;
};
function useFieldOptions<
  Field extends ControlledTextField | ControlledNumberField,
  Attr = 'checked' | 'selected',
>(
  field: Field,
  options: FieldOption<Field>[],
  attr: Attr,
): typeof attr extends 'checked'
  ? FieldOptionRadio<Field>[]
  : FieldOptionSelect<Field>[];
function useFieldOptions<
  Field extends ControlledTextField | ControlledNumberField,
>(field: Field, options: FieldOption<Field>[], attr: 'checked' | 'selected') {
  return useMemo(
    () =>
      options.map((option) => ({
        ...option,
        [attr]: option.value === field.value,
      })),
    [field.value, options, attr],
  );
}
