import { renderHook } from '@testing-library/react-hooks';

import {
  createFormUncontrolled,
  useFormUncontrolled,
} from 'createFormUncontrolled';

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

describe('createFormUncontrolled', () => {
  test('default Context - BlankForm defaults', async () => {
    const BlankForm = createFormUncontrolled();
    const { result } = renderHook(() => useFormUncontrolled(BlankForm));
    expect(result.current.options).toEqual({ props: {} });
  });

  test('default Provider - BlankForm.Provider defaults', () => {
    const BlankForm = createFormUncontrolled();
    const { result } = renderHook(() => useFormUncontrolled(BlankForm), {
      wrapper: BlankForm.Provider,
    });
    expect(result.current.options).toEqual({ props: {} });
  });

  test('Login Context/Provider - LoginForm defaults', async () => {
    const LoginForm = createFormUncontrolled<Login>();
    const { result } = renderHook(() => useFormUncontrolled(LoginForm), {
      wrapper: LoginForm.Provider,
      initialProps: {
        defaultValues: DEFAULT_LOGIN_VALUES,
      },
    });
    expect(result.current.options).toEqual({ props: {} });
    expect(result.current.email).toMatchObject({
      name: 'email',
      id: 'email',
      defaultValue: '',
    });
    expect(result.current.password).toMatchObject({
      name: 'password',
      id: 'password',
      defaultValue: '',
    });
  });
});
