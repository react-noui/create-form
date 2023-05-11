import { useMemo, ChangeEvent } from "react";
import { ControlledTextField, ControlledNumberField, ControlledTextSelectField, ControlledNumberSelectField, PrimitiveRecord, CreateForm, ControlledMultiOptionSelect, RequiredOptions } from "../types";
import { useForm } from "./useForm";

type SelectFieldAlgo<
  Field extends ControlledTextField | ControlledNumberField,
> = Field extends ControlledTextField
  ? ControlledTextSelectField
  : Field extends ControlledNumberField
  ? ControlledNumberSelectField
  : never;
export function useFormSelectField<
  T extends PrimitiveRecord,
  Field extends ControlledTextField | ControlledNumberField,
>(
  targetForm: CreateForm<T>,
  field: Field,
  options: RequiredOptions<Field['value']>[],
): [SelectFieldAlgo<Field>, ControlledMultiOptionSelect<Field['value']>[]];
export function useFormSelectField<
  T extends PrimitiveRecord,
  Field extends ControlledTextField | ControlledNumberField,
>(
  targetForm: CreateForm<T>,
  field: Field,
  options: RequiredOptions<Field['value']>[],
) {
  const form = useForm(targetForm);
  const selectOptions = useSelectOptions(field, options);
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

function useSelectOptions<
  Field extends ControlledTextField | ControlledNumberField
>(field: Field, options: RequiredOptions<Field['value']>[]) {
  return useMemo(
    () =>
      options.map((option) => ({
        ...option,
        selected: option.value === field.value,
      })),
    [field, options],
  );
}
