# create-form
[![CircleCI](https://circleci.com/gh/taystack/create-form.svg?style=shield)](https://circleci.com/gh/taystack/create-form)

[![npm downloads](https://img.shields.io/npm/dm/create-form.svg?style=flat-square)](https://www.npmjs.com/package/taystack/create-form)
[![gzip size](https://img.badgesize.io/https://unpkg.com/taystack/create-form?compression=gzip&amp;style=flat-square)](https://unpkg.com/taystack/create-form)
[![npm version](https://img.shields.io/npm/v/taystack/create-forms.svg?style=flat-square)](https://www.npmjs.com/package/taystack/create-form)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

create-form is a declarative, typescript-driven form control library. create-form allows you to quickly apply setters/getters/validators within atomic, props-less components by following React's Context API.

This README was generated by [anansi](https://github.com/ntucker/anansi/tree/master/packages/generator-js#readme).

## Installation
```bash
yarn add @taystack/create-form
```

## Usage

This library employs the factory pattern when creating the data-layer for your form controls.
If you are familiar with `React.createContext` then you will be familiar with how to use this library.

### `const MyForm = createForm(options? = {})`
```typescript
import { createForm } from '@taystack/create-form';

type Login = {
  email: string;
  password: string;
  session: boolean;
}

const LoginForm = createForm<Login>()
// { Context, Provider }
```

### Options
#### `options.validate: Record<K = keyof T, (value: T[K], values: T) => string | undefined>`
Provide custom validation methods upon receiving changes to key `K` of provided type `T`.
The keys allowed in your `validate` option must match the keys you provided from type `T`,
but are not required.

For the `LoginForm` example, we can provide options to validate `email | password`:
```typescript
const options = {
  validate: {
    email: (value) => !value.length ? 'Email cannot be empty' : undefined,
    password: (value) => !value.length ? 'Password cannot be empty' : undefined,
  },
};
```

### `LoginForm.Provider`
This behaves like `React.createContext(...).Provider` such that access to `LoginForm` values can only be made from components within this provider.
```tsx
const LOGIN_DEFAULTS: Login = {
  email: '',
  password: '',
  session: false,
}
function LoginFormPage() {
  return (
    <LoginForm.Provider defaultValue={LOGIN_DEFAULTS}>
      ...
    </LoginForm.Provider>
  )
}
```

#### Provider prop `defaultValue: T`
Where `T extends Record<string, string | number | boolean>`. This library currently supports primitive values. `HTML` change events typically involve primitive values.

This will be the default values we use in our form as type `T`. In the example above, `T` is of type `Login`.

### `LoginForm.Context`
This behaves like `React.createContext(...)` such that access to the `LoginForm` APIs can be made.
```tsx
// Controlled inputs
function LoginFormEmailComponent() {
  const form = React.useContext(LoginForm.Context);
  return (
    <>
      <label htmlFor={form.email.name}>Email</label>
      <input
        id={form.email.name}
        name={form.email.name}
        value={form.email.value}
        onChange={(event) => form.set.email(event.target.value)}
      />
      {form.email.error && <div>{form.email.error}</div>}
    </>
  )
};
```

### `const form = useContext(MyForm.Context)`
|**attribute**|**type**|**effect**|
|---|---|---|
|`form.resetAll()`|`() => void`|Resets `form[FIELD]` values, errors, files, etc. Resets `form[FIELD].current`to the `defaultValue` for all fields.|
|`form.toJSON()`|`() => void`|Returns JSON format matching shape `T`|
|`form.toFormData()`|`() => FormData`|Obtain `FormData` for use with http request/fetch `Content-Type: application/x-www-form-urlencoded`.|
|`form.toURLSearchParams()`|`() => string`|Returns query string with url-encoded form fields|


### `const field = useContext(MyForm.Context)[FIELD]`
Each field defined in `type T` is accessible via `form[FIELD]`
|**attribute**|**type**|**effect**|
|---|---|---|
|`[FIELD].default`|`T[keyof T]`|Default value provided by you within `<MyForm.Provider defaultValue={value} />`.|
|`[FIELD].current`|`T`|Current state of the form value.|
|`[FIELD].set(value: T[keyof T])`|`(value: T[keyof T]) => void`|Allows setting of `[FIELD].current` values for matching `[FIELD]`.|
|`[FIELD].error`|`string \| undefined`|Custom string will exist *if* you have the matching `options.validate[FIELD](value: T[keyof T])` defined.|
|`[FIELD].name`|`string`|Provides a random, unique value for use as a primary key for any given field.|
|`[FIELD].reset()`|`() => void`|Reset `[FIELD].current` state to `Provider.props.defaultValue[FIELD]`. Clears any files, reader data, etc.|
|`[FIELD].handleFileEvent(event: React.ChangeEvent<HTMLInputElement>)`|`() => void`|Allow files to be referenced for a file change event. `onChange={handleFileEvent}`. *(see side effects)|

#### Side effects

##### `[FIELD].handleFileEvent(event: React.ChangeEvent<HTMLInputElement>)`
This particular function will capture the `event.target.files` for use outside of the component in question.

## Example
Basic login form with `POST fetch` using JSON payload.
```tsx
const LoginForm = createForm<Login>({
  validate: {
    email: (value) => value.length === 0 ? 'Cannot be empty' : undefined,
    password: (value) => value.length === 0 ? 'Cannot be empty' : undefined,
  }
})

function Login() {
  return (
    <LoginForm.Provider defaultValue={{ email: '', password: '', session: false }}>
      <LoginEmailInput />
      <LoginPasswordInput />
      <LoginSessionInput />
      <LoginSubmitButton />
    </LoginForm.Provider>
  )
}
const LoginEmailInput = () => {
  const { email } = useContext(LoginForm.Context)
  return <input
    type="email"
    value={email.current}
    onChange={(e) => email.set(e.target.value)}
  />
}
const LoginPasswordInput = () => {
  const { password } = useContext(LoginForm.Context)
  return <input
    type="password"
    value={password.current}
    onChange={(e) => password.set(e.target.value)}
  />
}
const LoginSessionInput = () => {
  const { session } = useContext(LoginForm.Context)
  return <input
    type="checkbox"
    checked={session.current}
    onChange={(e) => session.set(e.target.checked)}
  />
}
const LoginSubmitButton = () => {
  const form = useContext(LoginForm.Context)
  const handleClick = useCallback(() => {
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(form.toJSON())
    })
  }, [form])
  return <button onClick={handleClick}>Log in</button>
}
```


## Development

With [Visual Studio Code](https://code.visualstudio.com), simply press `F5` to start the development server and browser.

#### Run dev:

```bash
yarn start
```

#### Build prod:

`Ctrl+shift+B` in [Visual Studio Code](https://code.visualstudio.com)

```bash
yarn build
```

#### Run prod: (after build)

```bash
yarn start:server
```

#### Analyze production bundle sizes:

```bash
yarn build:analyze
```

#### Run with [React Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html):

```bash
yarn build:profile
```

#### Check Packages for duplicates or circular dependencies:

```bash
yarn pkgcheck
```


#### Run with [Storybook](https://storybook.js.org/):

```bash
yarn storybook
```


#### Share demo on Stackblitz

https://stackblitz.com/github/taystack/create-form
