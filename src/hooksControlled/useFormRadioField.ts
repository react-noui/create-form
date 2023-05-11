import { useMemo, ChangeEvent } from 'react';

import { useForm } from './useForm';
import {
  ControlledTextField,
  ControlledNumberField,
  ControlledTextRadioField,
  ControlledNumberRadioField,
  PrimitiveRecord,
  CreateForm,
  RequiredOptions,
  ControlledMultiOptionRadio,
} from '../types';

type RadioFieldAlgo<Field extends ControlledTextField | ControlledNumberField> =
  Field extends ControlledTextField
    ? ControlledTextRadioField
    : Field extends ControlledNumberField
    ? ControlledNumberRadioField
    : never;
export function useFormRadioField<
  T extends PrimitiveRecord,
  Field extends ControlledTextField | ControlledNumberField,
>(
  targetForm: CreateForm<T>,
  field: Field,
  options: RequiredOptions<Field['value']>[],
): [RadioFieldAlgo<Field>, ControlledMultiOptionRadio<Field['value']>[]];
export function useFormRadioField<
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
