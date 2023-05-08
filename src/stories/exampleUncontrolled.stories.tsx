import { SyntheticEvent, useCallback, useState } from 'react';

import { createFormUncontrolled } from 'createFormUncontrolled';
import { useFormUncontrolled } from 'hooks/controlled';
import {
  useFormRadioUncontrolled,
  useFormSelectUncontrolled,
} from 'hooks/uncontrolled';
import { CreateFormOptions } from 'types';

export default { title: 'Uncontrolled/ExampleFormUncontrolled' };

export const exampleFormUncontrolled = () => {
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
    props: {
      text: { placeholder: 'props.text.placeholder' },
      checkbox: { type: 'checkbox', title: 'props.checkbox.title' },
      number: { type: 'number', step: 2 },
      range: { type: 'range', step: 10 },
      color: { type: 'color' },
    },
  };
  const ExampleForm = createFormUncontrolled<Example>(OPTIONS);
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
    const [submission, setSubmission] = useState<Example>();
    const form = useFormUncontrolled(ExampleForm);
    const selectOptions = useFormSelectUncontrolled(
      form.select,
      SELECT_STRING_OPTIONS,
    );
    const radioNumberOptions = useFormRadioUncontrolled(
      form.radioNumber,
      RADIO_NUMBER_OPTIONS,
    );
    const radioStringOptions = useFormRadioUncontrolled(
      form.radioString,
      RADIO_STRING_OPTIONS,
    );

    const handleSubmit = useCallback(
      (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmission(() =>
          Object.keys(EXAMPLE_DEFAULT_VALUES).reduce(
            (map, key) => ({
              ...map,
              [key]: `${data.get(key)}`,
            }),
            {} as Example,
          ),
        );
      },
      [setSubmission],
    );

    return (
      <div style={{ display: 'flex', gap: 20 }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            position: 'relative',
          }}
        >
          <label htmlFor={form.text.id}>text</label>
          <input {...form.text} />
          <label htmlFor={form.checkbox.id}>checkbox</label>
          <input {...form.checkbox} />
          <label htmlFor={form.color.id}>color</label>
          <input {...form.color} />
          <label htmlFor={form.date.id}>date</label>
          <input type="date" {...form.date} />
          <label htmlFor={form.datetimeLocal.id}>datetime-local</label>
          <input type="datetime-local" {...form.datetimeLocal} />
          <label htmlFor={form.number.id}>number</label>
          <input {...form.number} />
          <label htmlFor={form.range.id}>range</label>
          <input type="range" {...form.range} />
          <label htmlFor="radio-number-0">
            radio (number): Selected: {form.radioNumber.defaultValue}
          </label>
          {radioNumberOptions.map((option) => (
            <div key={option.value}>
              <input {...option} />
              <label htmlFor={option.id}>{option.label}</label>
            </div>
          ))}
          <label htmlFor="radio-string-0">
            radio (string): Default Selected {form.radioString.defaultValue}
          </label>
          {radioStringOptions.map((option) => (
            <div key={option.value}>
              <input {...option} />
              <label htmlFor={option.id}>String option {option.value}</label>
            </div>
          ))}
          <label htmlFor={form.select.id}>select</label>
          <select {...form.select}>
            <option value="" disabled></option>
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                String option {option.label}
              </option>
            ))}
          </select>
          <button type="submit">submit</button>
        </form>
        <pre>
          {submission && <>{JSON.stringify(submission, null, 2)}</>}
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
