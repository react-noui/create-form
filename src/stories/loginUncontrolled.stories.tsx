import { SyntheticEvent, useCallback, useState } from 'react';

import { createFormUncontrolled } from 'createFormUncontrolled';
import { useFormUncontrolled } from 'hooks/uncontrolled';

export default { title: 'Uncontrolled/LoginFormUncontrolled' };

export const loginFormUncontrolled = () => {
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

  const LoginForm = createFormUncontrolled<Login>({
    props: {
      email: {
        type: 'email',
        placeholder: 'Email',
        autoComplete: 'off',
      },
      password: {
        type: 'password',
        placeholder: 'Password',
        autoComplete: 'off',
      },
    },
  });

  function LoginFormComponent() {
    const [submission, setSubmission] = useState<string>('');
    const { email, password, session } = useFormUncontrolled(LoginForm);
    const handleSubmit = useCallback(
      (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmission(
          JSON.stringify(
            {
              email: data.get('email'),
              password: data.get('password'),
              session: data.get('session') ? true : false,
            },
            null,
            2,
          ),
        );
      },
      [],
    );
    return (
      <div style={{ display: 'flex', gap: 20 }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <label htmlFor={email.id}>Email</label>
          <input {...email} />

          <label htmlFor={password.id}>Password</label>
          <input {...password} />

          <label>
            <input type="checkbox" {...session} />
            <label htmlFor={session.id}>Keep me logged in</label>
          </label>
          <button type="submit">Submit</button>
        </form>
        <pre>
          {`
const handleSubmit = useCallback((event: SyntheticEvent<HTMLFormElement>) => {
  const data = new FormData(event.currentTarget);
  setJSON({
    email: data.get('email'),
    password: data.get('password'),
    session: data.get('session') ? true : false,
  })
}, [])`}
          <br />
          Click Submit to see submitted data as JSON...
          {submission}
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
