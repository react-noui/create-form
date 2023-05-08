import { PropsWithChildren, createContext, useContext, useMemo } from 'react';

import { makeOptionsUncontrolled } from 'makeOptions';
import { makeUncontrolledField } from 'makeUncontrolledField';
import {
  CreateFormUncontrolled,
  CreateFormUncontrolledOptions,
  FormContextUncontrolled,
  FormFieldsUncontrolled,
  PrimitiveRecord,
} from 'types';

export function createFormUncontrolled<T extends PrimitiveRecord>(
  options?: CreateFormUncontrolledOptions<T> | undefined,
) {
  const opts = makeOptionsUncontrolled<T>(options);
  const Context = createContext<FormContextUncontrolled<T>>({
    options: opts,
  } as FormContextUncontrolled<T>);
  function Provider({
    defaultValues = {} as T,
    ...props
  }: PropsWithChildren<{ defaultValues: T }>) {
    const keys = useMemo(
      () => Object.keys(defaultValues) as (string & keyof T)[],
      [defaultValues],
    );
    const fields = useMemo(() => {
      return keys.reduce((map, name: string & keyof T) => {
        return {
          ...map,
          [name]: {
            ...((opts.props && opts.props[name]) || {}),
            ...makeUncontrolledField(name, defaultValues[name]),
          },
        };
      }, {} as FormFieldsUncontrolled<T>);
    }, [keys, defaultValues]);
    return <Context.Provider value={{ ...fields, options: opts }} {...props} />;
  }
  return {
    Context,
    Provider,
  } as CreateFormUncontrolled<T>;
}

export function useFormUncontrolled<T extends PrimitiveRecord>(
  form: CreateFormUncontrolled<T>,
) {
  return useContext(form.Context);
}
