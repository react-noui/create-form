import React, {
  ChangeEvent,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { makeField } from './makeField';
import { makeOptions } from './makeOptions';
import {
  FieldSetters,
  FormContext,
  FormContextErrors,
  FormContextFiles,
  FormFields,
  PrimitiveRecord,
  CreateFormOptions,
  CreateForm,
  CreateFormProviderProps,
} from './types';
import { isFileList } from './utils';

export function createForm<T extends PrimitiveRecord>(
  options?: CreateFormOptions<T> | undefined,
) {
  const opts = makeOptions<T>(options);

  const Context = createContext<FormContext<T>>({
    toJSON: () => ({}),
    toFormData: () => new FormData(),
    validateAll: () => Promise.resolve({}),
    resetAll: () => {
      /*  noop*/
    },
    options: opts,
  } as FormContext<T>);

  function Provider({
    defaultValues = {} as T,
    ...props
  }: CreateFormProviderProps<T>) {
    const keys = useMemo(
      () => Object.keys(defaultValues) as (string & keyof T)[],
      [defaultValues],
    );
    const [state, setState] = useState(() => ({
      ...defaultValues,
    }));
    const [errors, setErrorState] = useState(() =>
      keys.reduce(
        (map, key) => ({
          ...map,
          [key]: '',
        }),
        {} as FormContextErrors<T>['errors'],
      ),
    );
    const files = useRef({} as FormContextFiles<T>);

    const setters = useMemo(
      () =>
        keys.reduce((map, key) => {
          return {
            ...map,
            [key]: (value: T[typeof key]) => {
              const validateFn = opts && opts.validate && opts.validate[key];
              if (validateFn) {
                const error = validateFn(value, defaultValues) || '';
                setErrorState((old) => ({
                  ...old,
                  [key]: error,
                }));
              }
              setState((old) => ({ ...old, [key]: value }));
            },
          };
        }, {} as FieldSetters<T>),
      [setState, defaultValues, keys],
    );

    const fields: FormFields<T> & (typeof opts)['props'] = useMemo(
      () =>
        keys.reduce((map, name: string & keyof T) => {
          return {
            ...map,
            [name]: {
              ...((opts.props && opts.props[name]) || {}),
              ...makeField(name, state[name], setters[name]),
            },
          };
        }, {} as FormFields<T> & (typeof opts)['props']),
      [keys, state, setters],
    );

    const toJSON = useCallback(
      () =>
        keys.reduce(
          (map, key) => ({
            ...map,
            [key]: state[key],
          }),
          {} as Partial<T>,
        ),
      [state, keys],
    );

    const validateAll = useCallback(async () => {
      const errors = await new Promise<FormContextErrors<T>['errors']>(
        (resolve) => {
          const errorsReduced = keys.reduce((map, key) => {
            const validateFn = opts && opts.validate && opts.validate[key];
            let err: string | undefined;
            if (validateFn) {
              err = validateFn(state[key], state);
            }
            return {
              ...map,
              [key]: err || '',
            };
          }, {} as FormContextErrors<T>['errors']);
          resolve(errorsReduced);
        },
      );
      setErrorState(() => errors);
      return errors;
    }, [keys, state, setErrorState]);

    const setError = useCallback(
      (key: keyof T, error?: string | undefined) => {
        setErrorState((old) => ({
          ...old,
          [key]: error || '',
        }));
      },
      [setErrorState],
    );

    const reset = useCallback(
      (key: keyof T) => {
        setState((old) => ({
          ...old,
          [key]: defaultValues[key],
        }));
      },
      [setState, defaultValues],
    );

    const resetAll = useCallback(() => {
      setState(() => defaultValues);
      files.current = {};
    }, [setState, defaultValues]);

    const toFormData = useCallback(() => {
      const formData = new FormData();
      keys.forEach((key) => {
        formData.set(key, `${state[key]}`);
      });
      return formData;
    }, [keys, state]);

    const handleFileEvent = useCallback(
      (key: keyof T) => {
        return (event: ChangeEvent<HTMLInputElement>) => {
          const eventFiles = event.target.files;
          files.current[key] = eventFiles;
          const filenames: string[] = [];
          if (isFileList(eventFiles)) {
            Array.from(eventFiles).forEach((file) => filenames.push(file.name));
          }
          const next = { [key]: filenames.join(',') };
          setState((old) => ({
            ...old,
            ...next,
          }));
        };
      },
      [setState],
    );

    const getFiles = useCallback((key: keyof T) => files.current[key], []);

    return (
      <Context.Provider
        value={
          {
            ...fields,
            errors,
            setters,
            validateAll,
            setError,
            reset,
            resetAll,
            handleFileEvent,
            getFiles,
            toFormData,
            toJSON,
            options: opts,
          } as FormContext<T>
        }
        {...props}
      />
    );
  }
  return {
    Context,
    Provider,
  } as CreateForm<T>;
}
