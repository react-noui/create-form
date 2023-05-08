import { createForm } from 'createForm';
import { useForm, useFormRadio, useFormSelect } from 'hooks/controlled';
import { CreateFormOptions } from 'types';

export default { title: 'forms/ExampleForm' };

function ErrorLabel({
  id,
  error,
  children,
}: React.PropsWithChildren<{
  id: string;
  error?: string;
}>) {
  return (
    <label htmlFor={id} style={{ color: error ? 'red' : 'currentcolor' }}>
      <span>{children}</span> {error ? <span>{error}</span> : null}
    </label>
  );
}

export const exampleForm = () => {
  type Example = {
    checkbox: boolean;
    color: string;
    date: string;
    datetimeLocal: string;
    number: number;
    radioNumber: number;
    radioString: string;
    range: number;
    text: string;
    select: string;
  };
  const EXAMPLE_DEFAULT_VALUES: Example = {
    checkbox: false,
    color: '#f94885',
    date: '',
    datetimeLocal: '',
    number: 0,
    radioNumber: -1,
    radioString: '',
    range: 0,
    text: '',
    select: '',
  };
  const OPTIONS: CreateFormOptions<Example> = {
    validate: {
      text: (value) => (value.length === 0 ? 'Dirty check error' : undefined),
      number: (value) => (value === 0 ? 'Dirty check error' : undefined),
      checkbox: (value) => (!value ? 'Dirty check error' : undefined),
      date: (value) =>
        new Date(value).getTime() - new Date().getTime() < 0
          ? 'No going back in time'
          : undefined,
      datetimeLocal: (value) =>
        new Date(value).getTime() - new Date().getTime() < 0
          ? 'No going back in time'
          : undefined,
    },
    props: {
      text: { placeholder: 'props.text.placeholder' },
      checkbox: { type: 'checkbox', title: 'props.checkbox.title' },
      number: { type: 'number', step: 2 },
      range: { type: 'range', step: 10 },
      color: { type: 'color' },
    },
  };
  const ExampleForm = createForm<Example>(OPTIONS);
  const RADIO_NUMBER_OPTIONS = [
    { label: 'Number option 1', value: 1 },
    { label: 'Number option 2', value: 2 },
    { label: 'Number option 3', value: 3 },
    { label: 'Number option 4', value: 4 },
  ];
  const RADIO_STRING_OPTIONS = [
    { label: 'String option A', value: 'A' },
    { label: 'String option B', value: 'B' },
    { label: 'String option C', value: 'C' },
    { label: 'String option D', value: 'D' },
  ];
  const SELECT_STRING_OPTIONS = [
    { label: 'Option A', value: 'A' },
    { label: 'Option B', value: 'B' },
    { label: 'Option C', value: 'C' },
    { label: 'Option D', value: 'D' },
  ];
  function ExampleFormComponent() {
    const form = useForm(ExampleForm);
    const [selectField, selectOptions] = useFormSelect(
      ExampleForm,
      form.select,
      SELECT_STRING_OPTIONS,
    );
    const [radioNumber, radioNumberOptions] = useFormRadio(
      ExampleForm,
      form.radioNumber,
      RADIO_NUMBER_OPTIONS,
    );
    const [radioString, radioStringOptions] = useFormRadio(
      ExampleForm,
      form.radioString,
      RADIO_STRING_OPTIONS,
    );
    form.checkbox;
    form.number;
    form.text;

    return (
      <div style={{ display: 'flex', gap: 20 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            position: 'relative',
          }}
        >
          <ErrorLabel id={form.text.id}>text</ErrorLabel>
          <input {...form.text} />
          <ErrorLabel id={form.checkbox.id}>checkbox</ErrorLabel>
          <input {...form.checkbox} />
          <ErrorLabel id={form.color.id}>color</ErrorLabel>
          <input {...form.color} />
          <ErrorLabel id={form.date.id}>date</ErrorLabel>
          <input type="date" {...form.date} />
          <ErrorLabel id={form.datetimeLocal.id}>datetime-local</ErrorLabel>
          <input type="datetime-local" {...form.datetimeLocal} />
          <ErrorLabel id={form.number.id}>number</ErrorLabel>
          <input {...form.number} />
          <ErrorLabel id={form.range.id}>range</ErrorLabel>
          <input type="range" {...form.range} />
          <label htmlFor="radio-number-0">
            radio (number): Selected: {radioNumber.value}
          </label>
          {radioNumberOptions.map((option) => (
            <div key={option.value}>
              <input
                type="radio"
                {...option}
                id={`radio-number-${option.value}`}
              />
              <label htmlFor={`radio-number-${option.value}`}>
                {option.label}
              </label>
            </div>
          ))}
          <label htmlFor="radio-string-0">
            radio (string): Selected {radioString.value}
          </label>
          {radioStringOptions.map((option) => (
            <div key={option.value}>
              <input
                type="radio"
                {...option}
                id={`radio-string-${option.value}`}
              />
              <label htmlFor={`radio-string-${option.value}`}>
                String option {option.value}
              </label>
            </div>
          ))}
          <ErrorLabel id={selectField.id}>select</ErrorLabel>
          <select {...selectField}>
            <option value="" disabled></option>
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                String option {option.label}
              </option>
            ))}
          </select>
          <button onClick={() => form.resetAll()}>Reset</button>
        </div>
        <pre>
          {JSON.stringify(form, null, 2)}
          <br />
          {JSON.stringify(form.options, null, 2)}
        </pre>
      </div>
    );
  }
  return (
    <ExampleForm.Provider defaultValues={EXAMPLE_DEFAULT_VALUES}>
      <ExampleFormComponent />
    </ExampleForm.Provider>
  );
};
