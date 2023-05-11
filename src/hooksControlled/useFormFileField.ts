import { useMemo } from "react";
import { PrimitiveRecord, CreateForm, ControlledTextField } from "../types";
import { useForm } from "./useForm";

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
