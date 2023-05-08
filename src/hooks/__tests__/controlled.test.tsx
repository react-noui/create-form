import { act, renderHook } from '@testing-library/react-hooks';
import { ChangeEvent } from 'react';

import { createForm } from 'createForm';
import {
  useForm,
  useFormFileField,
  useFormRadio,
  useFormSelect,
} from 'hooks/controlled';
import { Primitive } from 'types';

type Example = {
  string: string;
  number: number;
  checkbox: boolean;
  radioString: string;
  radioNumber: number;
  selectString: string;
  selectNumber: number;
  file: string;
};

const EXAMPLE_DEFAULTS: Example = {
  string: '',
  number: 0,
  checkbox: false,
  radioString: '',
  radioNumber: 0,
  selectString: '',
  selectNumber: 0,
  file: '',
};

const ExampleForm = createForm<Example>();

const STRING_OPTIONS = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
];
const NUMBER_OPTIONS = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
];

function makeChangeEventSelect<T extends Primitive>(value: T) {
  return {
    target: { value },
  } as ChangeEvent<HTMLSelectElement>;
}
function makeChangeEventRadio<T extends Primitive>(value: T) {
  return {
    target: { value },
  } as ChangeEvent<HTMLInputElement>;
}

describe('Controlled form', () => {
  test('useFormSelect should provide properties for a select string', () => {
    const { result } = renderHook(
      () =>
        useFormSelect(
          ExampleForm,
          useForm(ExampleForm).selectString,
          STRING_OPTIONS,
        ),
      {
        wrapper: ExampleForm.Provider,
        initialProps: {
          defaultValues: EXAMPLE_DEFAULTS,
        },
      },
    );
    const [field, options] = result.current;
    act(() => {
      field.onChange(makeChangeEventSelect(options[0].value));
    });
    expect(result.current[0].value).toEqual(options[0].value);
  });

  test('useFormSelect should provide properties for a select number', () => {
    const { result } = renderHook(
      () =>
        useFormSelect(
          ExampleForm,
          useForm(ExampleForm).selectNumber,
          NUMBER_OPTIONS,
        ),
      {
        wrapper: ExampleForm.Provider,
        initialProps: {
          defaultValues: EXAMPLE_DEFAULTS,
        },
      },
    );
    const [field, options] = result.current;
    const option = options[0];
    act(() => {
      field.onChange(makeChangeEventSelect(option.value));
    });
    expect(result.current[0].value).toEqual(option.value);
    expect(result.current[1][0].selected).toEqual(true);
    expect(result.current[1][1].selected).toEqual(false);
  });

  test('useFormRadio should provide properties for a select string', () => {
    const { result } = renderHook(
      () =>
        useFormRadio(
          ExampleForm,
          useForm(ExampleForm).selectString,
          STRING_OPTIONS,
        ),
      {
        wrapper: ExampleForm.Provider,
        initialProps: {
          defaultValues: EXAMPLE_DEFAULTS,
        },
      },
    );
    const [field, options] = result.current;
    expect(options).toMatchObject([
      { checked: false, value: STRING_OPTIONS[0].value },
      { checked: false, value: STRING_OPTIONS[1].value },
    ]);
    const option = options[0];
    act(() => {
      field.onChange(makeChangeEventRadio(option.value));
    });
    expect(result.current[0].value).toEqual(option.value);
    expect(result.current[1][0].checked).toEqual(true);
    expect(result.current[1][1].checked).toEqual(false);
  });

  test('useFormRadio should provide properties for a select number', () => {
    const { result } = renderHook(
      () =>
        useFormRadio(
          ExampleForm,
          useForm(ExampleForm).selectNumber,
          NUMBER_OPTIONS,
        ),
      {
        wrapper: ExampleForm.Provider,
        initialProps: {
          defaultValues: EXAMPLE_DEFAULTS,
        },
      },
    );
    const [field, options] = result.current;
    expect(options).toMatchObject([
      { checked: false, value: NUMBER_OPTIONS[0].value },
      { checked: false, value: NUMBER_OPTIONS[1].value },
    ]);
    const option = options[0];
    act(() => {
      field.onChange(makeChangeEventRadio(option.value));
    });
    expect(result.current[0].value).toEqual(option.value);
    expect(result.current[1][0].checked).toEqual(true);
    expect(result.current[1][1].checked).toEqual(false);
  });

  test('useFormFileField omits controlled value', () => {
    const { result } = renderHook(
      () => useFormFileField(ExampleForm, useForm(ExampleForm).file),
      {
        wrapper: ExampleForm.Provider,
        initialProps: {
          defaultValues: EXAMPLE_DEFAULTS,
        },
      },
    );
    expect(result.current).not.toMatchObject({ value: '' });
  });
});
