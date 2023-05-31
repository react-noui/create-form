# create-form
[![gzip size](https://img.badgesize.io/https://unpkg.com/@react-noui/create-form?compression=gzip&amp;style=flat-square)](https://unpkg.com/@react-noui/create-form)
[![npm version](https://img.shields.io/npm/v/@react-noui/create-form.svg?style=flat-square)](https://www.npmjs.com/package/@react-noui/create-form)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

create-form is a declarative, typescript-driven form control library. create-form allows you to quickly apply setters/getters/validators within atomic, props-less components by following React's Context API.

## Installation
```bash
yarn add @react-noui/create-form
```

# Create form

This library employs the factory pattern when creating the data-layer for your form controls.
If you are familiar with `React.createContext` then you will be familiar with how to use this library.

# Example
`createForm` creates the state management for Controlled inputs. This example uses https://jsonplaceholder.typicode.com/todos for an example network payload.
```tsx
type Todo = {
  id?: number;
  userId: number;
  title: string;
  completed: boolean;
}
const TodoForm = createForm<Todo>({
  props: {
    completed: {
      type: 'checkbox',
    },
    title: {
      placeholder: 'What needs to be done?',
    },
    userId: {
      type: 'hidden', // required, but only for fetch
    },
  },
});
function CreateTodo({ user }: { user: User }) {
  return (
    <TodoForm.Provider defaultValues={{ userId: user.id, title: '', completed: false }}>
      <TodoCompleted />
      <TodoTitle />
      <TodoUserId />
      <CreateTodoSave />
    </TodoForm.Provider>
  );
}
function EditTodo({ user, todo }: { user: User, todo: Todo }) {
  return (
    <TodoForm.Provider defaultValues={todo}>
      <TodoCompleted />
      <TodoTitle />
      <TodoUserId />
      <EditTodoSave todoId={todo.id} />
    </TodoForm.Provider>
  );
}
function TodoCompleted() {
  const { completed } = useForm(TodoForm);
  return <input {...completed} />
}
function TodoTitle() {
  const { title } = useForm(TodoForm);
  return <input {...title} />
}
function TodoUserId() {
  const { userId } = useForm(TodoForm);
  return <input {...userId} />
}
function EditTodoSave({ todoId }: { todoId: number }) {
  const form = useForm(TodoForm);
  const handleClick = useCallback(() => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(form.toJSON()),
    });
  }, [form, todoId]);
  return <button onClick={handleClick}>Update</button>
}
function CreateTodoSave() {
  const form = useForm(TodoForm);
  const handleClick = useCallback(() => {
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(form.toJSON()),
    });
  }, [form]);
  return <button onClick={handleClick}>Create</button>
}
```

## Controlled

### `const MyForm = createForm<T>(options? = {})`
```typescript
import { createForm } from '@react-noui/create-form';

type Login = {
  email: string;
  password: string;
  session: boolean;
}

const LoginForm = createForm<Login>()
// -> { Context, Provider }
```

### Options
#### Props
##### `options.props: Record<K = keyof T, DetailedHTMLProps<HTMLInputElement>>`
These props map directly to the desired field. `Props` can be any semantic `HTMLInputElement` propery.
```typescript
const LoginForm = createForm<Login>({
  props: {
    email: {
      type: 'email',
      placeholder: 'Account email',
    },
    password: {
      type: 'password',
      placeholder: 'Account password',
    },
  },
});
```

#### Validation
Validation is currently only supported on controlled forms (ie: `createForm`).
##### `options.validate: Record<K = keyof T, (value: T[K], values: T) => string | undefined>`
Provide custom validation methods upon receiving changes to key `K` of provided type `T`.
The keys allowed in your `validate` option must match the keys you provided from type `T`,
but are not required.

For the `LoginForm` example, we can provide options to validate `email | password`:
```typescript
const LoginForm = createForm<Login>({
  validate: {
    email: (value) => !value.length ? 'Email cannot be empty' : undefined,
    password: (value) => !value.length ? 'Password cannot be empty' : undefined,
  },
});
```

## Uncontrolled
If you don't want to use controlled inputs, you can create an uncontrolled form. Most of the controlled APIs do not exist for uncontrolled forms due to the nature of uncontrolled inputs.
Also, `options.validate` is not possible because `onChange` events are no longer run against the individual inputs.

### `const MyFormUncontrolled = createFormUncontrolled<T>(options? = {})`
```typescript
import { createFormUncontrolled } from '@react-noui/create-form';
const LoginForm = createFormUncontrolled<Login>({
  props: {...}
})
// -> { Context, Provider }
```

# Hooks
## Controlled
### `useForm(LoginForm)`
Short-cut access to the `LoginForm` APIs. This should be composed within `LoginForm.Provider`.
```typescript
function LoginFormConsumer() {
  const form = useForm(LoginForm)
  // ...
}
```
|**attribute**|**type**|**effect**|
|---|---|---|
|`form.reset(field)`|`(form[FIELD]) => void`|Resets `form[FIELD]` values, errors, files, etc. Resets `form[FIELD].current`to the `defaultValues[field.name]` for `field`.|
|`form.resetAll()`|`() => void`|Resets `form[FIELD]` values, errors, files, etc. Resets `form[FIELD].current`to the `defaultValues` for all fields.|
|`form.toJSON()`|`() => void`|Returns JSON format matching shape `T`|
|`form.toFormData()`|`() => FormData`|Obtain `FormData` for use with http request/fetch `Content-Type: application/x-www-form-urlencoded`.|
|`form.toURLSearchParams()`|`() => string`|Returns query string with url-encoded form fields|
|`form.options`|`{props: {...}, validate: {...}}`|Returns the `options` used in `createForm(options)`|

## Uncontrolled
### `useFormUncontrolled(LoginForm)`
Short-cut access to the **Uncontrolled** `LoginForm` APIs. This should be composed within `LoginForm.Provider`.
```typescript
function LoginFormConsumer() {
  const form = useFormUncontrolled(LoginForm)
  // ...
}
```
|**attribute**|**type**|**effect**|
|---|---|---|
|`form.options`|`{props: {...}}`|Returns the `options` used in `createFormUncontrolled(options)`|

## Provider `LoginForm.Provider`
This behaves like `React.createContext(...).Provider` such that access to `LoginForm` values can only be made from components within this provider.

```tsx
const LOGIN_DEFAULTS: Login = {
  email: '',
  password: '',
  session: false,
}
function LoginFormPage() {
  return (
    <LoginForm.Provider defaultValues={LOGIN_DEFAULTS}>
      {...components}
    </LoginForm.Provider>
  )
}
```

#### Provider prop `defaultValues: T`
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

### `const field = useContext(MyForm.Context)[FIELD]`
Each field defined in `type T` is accessible via `form[FIELD]`. A form's fields depend on the values in `type T`.
```typescript
// CONTROLLED FIELDS
type ControlledTextField;
// : { value, onChange, name, id, ...options.props[FIELD] }
type ControlledNumberField;
// : { value, onChange, name, id, ...options.props[FIELD] }
type ControlledBooleanField;
// : { checked, onChange, name, id, ...options.props[FIELD] }

// UNCONTROLLED FIELDS
type UncontrolledTextField;
// : { defaultValue, name, id, ...options.props[FIELD] }
type UncontrolledNumberField;
// : { defaultValue, name, id, ...options.props[FIELD] }
type UncontrolledBooleanField;
// : { defaultChecked, name, id, ...options.props[FIELD] }
```

For the `Todo` example above, a form's fields would look like this:
```typescript
const form = useForm(TodoForm);
form.completed
// : ControlledBooleanField
form.completed.checked
// -> false
form.completed.type
// -> 'checkbox'
form.completed.onChange
// -> (event: ChangeEvent<HTMLInputElement>)
form.title
// : ControlledTextField
form.title.value
// -> ''
form.title.onChange
// -> (event: ChangeEvent<HTMLInputElement>)
```

# Uncontrolled Example
Basic uncontrolled login form with `POST fetch` using JSON payload.
```tsx
const LoginForm = createForm<Login>({
  props: {
    email: {
      type: 'email',
      placeholder: 'Your email',
    },
    password: {
      type: 'password',
      placeholder: 'Your password',
    }
  },
})

function Login() {
  return (
    <LoginForm.Provider defaultValues={{ email: '', password: '', session: false }}>
      <Form>
        <LoginEmail />
        <LoginEmailError />
        <LoginPassword />
        <LoginPasswordError />
        <SubmitButton />
      </Form>
    </LoginForm.Provider>
  )
}
function Form() {
  return <form method="POST" action="/login">{children}</form>
}
function LoginEmail() {
  const { email } = useForm(LoginForm);
  return <input {...email} />
}
function LoginEmailError() {
  const { errors } = useForm(LoginForm);
  return (errors.email ? <span>{errors.email}</span> : null)
}
function LoginPassword() {
  const { password } = useForm(LoginForm);
  return <input {...password} />
}
function LoginPasswordError() {
  const { errors } = useForm(LoginForm);
  return (errors.password ? <span>{errors.password}</span> : null)
}
function SubmitButton() {
  const form = useForm(LoginForm);
  const handleClick = useCallback(() => {
    fetch('/login', { method: 'post', body: JSON.stringify(form.toJSON()) })
  }, [form])
  return <button type="submit">Login</button>
}
```

# Special fields
Notable "special" fields do not fit nicely into the `<input {...} />` pattern.

- Select `<select {...} />` - https://react.dev/reference/react-dom/components/select
- Textarea `<textarea {...}></textarea>` - https://react.dev/reference/react-dom/components/textarea
- Radio Group

### `useFormSelectField(form, field)`
### `useFormRadioField(form, field)`
### `useFormTextAreaField(form, field)`


## Development

This README was generated by [anansi](https://github.com/ntucker/anansi/tree/master/packages/generator-js#readme).


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

https://stackblitz.com/github/react-noui/create-form
