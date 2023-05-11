import { act, fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { ChangeEvent } from 'react';

import { createForm } from '../createForm';
import { useForm } from '../hooksControlled';

type Login = {
  email: string;
  password: string;
  session: boolean;
};

const DEFAULT_LOGIN_VALUES: Login = {
  email: '',
  password: '',
  session: false,
};

function makeChangeEvent(value: string | boolean) {
  if (typeof value === 'boolean') {
    return { target: { checked: value } } as ChangeEvent<HTMLInputElement>;
  }
  return { target: { value } } as ChangeEvent<HTMLInputElement>;
}

describe('createForm', () => {
  test('default Context - BlankForm defaults', async () => {
    const BlankForm = createForm();
    const { result } = renderHook(() => useForm(BlankForm));
    expect(result.current.options).toEqual({ props: {}, validate: {} });
    expect(result.current.toJSON()).toEqual({});
    expect(result.current.toFormData()).toEqual(new FormData());
    await expect(result.current.validateAll()).resolves.toEqual({});
    expect(() => {
      result.current.resetAll();
    }).not.toThrowError();
  });

  test('default Provider - BlankForm.Provider defaults', () => {
    const BlankForm = createForm();
    const { result } = renderHook(() => useForm(BlankForm), {
      wrapper: BlankForm.Provider,
    });
    expect(result.current.options).toEqual({ props: {}, validate: {} });
  });

  test('form.field.set', () => {
    const LoginForm = createForm<Login>({
      validate: {
        password: (value) => (value.length === 0 ? 'Error' : ''),
      },
    });
    const { result } = renderHook(() => useForm(LoginForm), {
      wrapper: LoginForm.Provider,
      initialProps: {
        defaultValues: DEFAULT_LOGIN_VALUES,
      },
    });

    act(() => {
      result.current.email.onChange(makeChangeEvent('foo@bar.com'));
      result.current.password.onChange(makeChangeEvent('Password123'));
      result.current.session.onChange(makeChangeEvent(true));
    });
    expect(result.current.email.value).toEqual('foo@bar.com');
    expect(result.current.password.value).toEqual('Password123');
    expect(result.current.session.checked).toBeTruthy();
  });

  test('options.validate', () => {
    const LoginForm = createForm<Login>({
      validate: {
        email: (value) =>
          value.length === 0 ? 'Email cannot be empty' : undefined,
        password: (value, obj) =>
          obj.email.length === 0 || value.length === 0
            ? 'Password cannot be empty'
            : undefined,
      },
    });
    const { result } = renderHook(() => useForm(LoginForm), {
      wrapper: LoginForm.Provider,
      initialProps: {
        defaultValues: {
          email: 'foo@gmail.com',
          password: 'password',
          session: false,
        },
      },
    });

    expect(result.current.errors.email).toBe('');
    expect(result.current.errors.password).toBe('');
    expect(result.current.errors.session).toBe('');

    act(() => {
      result.current.email.onChange(makeChangeEvent(''));
      result.current.password.onChange(makeChangeEvent(''));
      result.current.session.onChange(makeChangeEvent(true));
    });
    expect(result.current.errors.email).toEqual('Email cannot be empty');
    expect(result.current.errors.password).toEqual('Password cannot be empty');
    expect(result.current.errors.session).toEqual('');
  });

  test('form.validateAll', async () => {
    const LoginForm = createForm<Login>({
      validate: {
        email: (value) =>
          value.length === 0 ? 'Email cannot be empty' : undefined,
        password: (value) =>
          value.length === 0 ? 'Password cannot be empty' : undefined,
      },
    });
    const { result } = renderHook(() => useForm(LoginForm), {
      wrapper: LoginForm.Provider,
      initialProps: {
        defaultValues: DEFAULT_LOGIN_VALUES,
      },
    });

    expect(result.current.errors.email).toBe('');
    expect(result.current.errors.password).toBe('');

    let errors: Record<string, string | undefined>;
    await act(async () => {
      errors = await result.current.validateAll();
      expect(errors).toEqual({
        email: 'Email cannot be empty',
        password: 'Password cannot be empty',
        session: '',
      });
    });

    expect(result.current.errors.email).toEqual('Email cannot be empty');
    expect(result.current.errors.password).toEqual('Password cannot be empty');
  });

  test('form.field.setError', () => {
    const LoginForm = createForm<Login>();
    const { result } = renderHook(() => useForm(LoginForm), {
      wrapper: LoginForm.Provider,
      initialProps: {
        defaultValues: {
          email: 'foo@gmail.com',
          password: 'password',
          session: false,
        },
      },
    });

    expect(result.current.errors.email).toBe('');
    expect(result.current.errors.password).toBe('');

    act(() => {
      result.current.setError('email', 'Invalid email');
      result.current.setError('password', 'Invalid password');
    });

    expect(result.current.errors.email).toEqual('Invalid email');
    expect(result.current.errors.password).toEqual('Invalid password');

    act(() => {
      result.current.setError('email');
      result.current.setError('password');
    });

    expect(result.current.errors.email).toBe('');
    expect(result.current.errors.password).toBe('');
  });

  test('form.field.reset', () => {
    const LoginForm = createForm<Login>();
    const { result } = renderHook(() => useForm(LoginForm), {
      wrapper: LoginForm.Provider,
      initialProps: {
        defaultValues: DEFAULT_LOGIN_VALUES,
      },
    });

    act(() => {
      result.current.email.onChange(makeChangeEvent('foo@bar.com'));
      result.current.password.onChange(makeChangeEvent('Password123'));
      result.current.session.onChange(makeChangeEvent(true));
    });

    act(() => {
      result.current.reset('email');
    });
    expect(result.current.email.value).toEqual(DEFAULT_LOGIN_VALUES.email);
  });

  test('form.resetAll', () => {
    const LoginForm = createForm<Login>();
    const { result } = renderHook(() => useForm(LoginForm), {
      wrapper: LoginForm.Provider,
      initialProps: {
        defaultValues: DEFAULT_LOGIN_VALUES,
      },
    });

    act(() => {
      result.current.email.onChange(makeChangeEvent('foo@bar.com'));
      result.current.password.onChange(makeChangeEvent('Password123'));
      result.current.session.onChange(makeChangeEvent(true));
    });

    act(() => {
      result.current.resetAll();
    });
    expect(result.current.toJSON()).toEqual(DEFAULT_LOGIN_VALUES);
  });

  test('form.field.handleFileEvent', () => {
    const FileForm = createForm<{ myField: string }>();
    function FileFormComponent({
      callback,
    }: {
      callback: (fileList: FileList | null) => void;
    }) {
      const { myField, handleFileEvent, getFiles } = useForm(FileForm);
      return (
        <>
          <input
            data-testid="myField"
            id={myField.name}
            onChange={handleFileEvent('myField')}
          />
          <button onClick={() => callback(getFiles('myField'))}>
            GET_FILES
          </button>
        </>
      );
    }
    const file = new File([new Blob(['MOCK_FILE_TEXT'])], 'text/plain');
    let userInput: FileList | null = null;
    const callback = (fileList: FileList | null) => {
      userInput = fileList;
    };
    const { getByTestId, getByText } = render(
      <FileFormComponent callback={callback} />,
      {
        wrapper: ({ children }) => (
          <FileForm.Provider defaultValues={{ myField: '' }}>
            {children}
          </FileForm.Provider>
        ),
      },
    );
    act(() => {
      fireEvent.change(getByTestId('myField'), {
        target: { files: [file], value: 'my_file.txt' },
      });
    });
    act(() => {
      fireEvent.click(getByText('GET_FILES'));
    });
    expect(userInput).toEqual([file]);
  });

  test('form.toJSON', () => {
    const LoginForm = createForm<Login>();
    const { result } = renderHook(() => useForm(LoginForm), {
      wrapper: LoginForm.Provider,
      initialProps: {
        defaultValues: DEFAULT_LOGIN_VALUES,
      },
    });
    act(() => {
      result.current.email.onChange(makeChangeEvent('foo@gmail.com'));
      result.current.password.onChange(makeChangeEvent('password'));
    });
    const json = result.current.toJSON();
    expect(json).toEqual({
      email: 'foo@gmail.com',
      password: 'password',
      session: false,
    });
  });

  test('form.toFormData', () => {
    const LoginForm = createForm<Login>();
    const { result } = renderHook(() => useForm(LoginForm), {
      wrapper: LoginForm.Provider,
      initialProps: {
        defaultValues: DEFAULT_LOGIN_VALUES,
      },
    });
    act(() => {
      result.current.email.onChange(makeChangeEvent('foo@gmail.com'));
      result.current.password.onChange(makeChangeEvent('password'));
    });
    const formData = result.current.toFormData();
    expect(formData.get('email')).toEqual('foo@gmail.com');
    expect(formData.get('password')).toEqual('password');
    expect(formData.get('session')).toEqual('false');
  });
});
