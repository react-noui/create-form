import { useContext, useMemo } from 'react';

import {
  PrimitiveRecord,
  UncontrolledTextField,
  UncontrolledNumberField,
  CreateFormUncontrolled,
} from 'types';

export function useFormUncontrolled<T extends PrimitiveRecord>(
  form: CreateFormUncontrolled<T>,
) {
  return useContext(form.Context);
}

export function useFormRadioUncontrolled<
  Field extends UncontrolledTextField | UncontrolledNumberField,
>(
  field: Field,
  options: { value: Field['defaultValue']; label: string }[],
): RadioOptionUncontrolled<Field>[] {
  return useMemo(
    () =>
      options.map((option) => ({
        ...option,
        id: `${field.id}-option-${option.value}`,
        type: 'radio',
        name: field.name,
        defaultChecked: option.value === field.defaultValue,
      })),
    [options, field],
  );
}

type RadioOptionUncontrolled<
  Field extends UncontrolledTextField | UncontrolledNumberField,
> = {
  id: string;
  type: 'radio';
  name: string;
  value: Field['defaultValue'];
  label: string;
  defaultChecked: boolean;
};

export function useFormSelectUncontrolled<
  Field extends UncontrolledTextField | UncontrolledNumberField,
>(
  field: Field,
  options: { value: Field['defaultValue']; label: string }[],
): SelectOptionUncontrolled<Field>[] {
  return useMemo(
    () =>
      options.map((option) => ({
        ...option,
        defaultSelected: option.value === field.defaultValue,
      })),
    [field, options],
  );
}

type SelectOptionUncontrolled<
  Field extends UncontrolledTextField | UncontrolledNumberField,
> = {
  value: Field['defaultValue'];
  label: string;
  defaultSelected: boolean;
};
