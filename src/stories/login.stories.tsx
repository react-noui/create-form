import { createForm } from 'createForm';
import { useForm } from 'hooks/controlled';

export default { title: 'forms/LoginForm' };

export const loginForm = () => {
  type Login = {
    email: string;
    password: string;
    session: boolean;
  };

  const DEFAULT_LOGIN: Login = {
    email: '',
    password: '',
    session: false,
  };

  const LoginForm = createForm<Login>({
    validate: {
      email: (value) => (value.length === 0 ? 'cannot be empty' : undefined),
      password: (value) => (value.length === 0 ? 'cannot be empty' : undefined),
    },
    props: {
      email: {
        placeholder: 'Email',
      },
      password: {
        placeholder: 'Password',
      },
    },
  });

  function ErrorLabel({
    field,
    error,
    children,
  }: React.PropsWithChildren<{
    field: { name: string };
    error: string | undefined;
  }>) {
    return (
      <label htmlFor={field.name}>
        <span>{children}</span>
        {error && <span style={{ color: 'red' }}> {error}</span>}
      </label>
    );
  }

  function LoginFormComponent() {
    const form = useForm(LoginForm);
    const { email, password, session, errors } = form;
    return (
      <div style={{ display: 'flex', gap: 20 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <ErrorLabel field={email} error={errors.email}>
            Email
          </ErrorLabel>
          <input {...email} autoComplete="off" />

          <ErrorLabel error={errors.password} field={password}>
            Password
          </ErrorLabel>
          <input {...password} type="password" autoComplete="off" />

          <label>
            <input type="checkbox" {...session} />
            <label htmlFor={session.id}>Keep me logged in</label>
          </label>
          {/* <button onClick={() => form.resetAll()}>Reset</button> */}
        </div>
        <pre>
          <div>STATE:</div>
          {JSON.stringify(form, null, 2)}
          <div>ERRORS:</div>
          <pre>{JSON.stringify(form.errors, null, 2)}</pre>
          <div>OPTIONS:</div>
          <pre>{JSON.stringify(form.options, null, 2)}</pre>
        </pre>
      </div>
    );
  }
  return (
    <LoginForm.Provider defaultValues={DEFAULT_LOGIN}>
      <LoginFormComponent />
    </LoginForm.Provider>
  );
};
