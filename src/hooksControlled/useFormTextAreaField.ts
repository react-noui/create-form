import { useMemo, ChangeEvent } from 'react';

import { useForm } from './useForm';
import {
  ControlledTextField,
  PrimitiveRecord,
  CreateForm,
  ControlledTextAreaField,
} from '../types';

export function useFormTextAreaField<
  T extends PrimitiveRecord,
>(
  targetForm: CreateForm<T>,
  field: ControlledTextField,
) {
  const form = useForm(targetForm);
  return useMemo(() => {
    const { value, onChange, ...rest } = field;
    return [
      {
        ...rest,
        onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
          form.setters[field.name](event.target.value as T[typeof field.name]);
        },
      },
      value,
    ] as [ControlledTextAreaField & typeof form['options']['props'], string];
  }, [form, field]);
}
