import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';

import { createForm } from '../createForm';
import { useForm, useFormFileField } from '../hooksControlled';

type MyFiles = {
  myFilesField: string;
  foo: string;
};

describe('toFormData', () => {
  /**
   * @TODO Figure out why jest is raising the following error:
   *
   * InvalidStateError: This input element accepts a filename, which may only be programmatically set to the empty string.
   *
   */
  test.skip('form.field.handleFileEvent with form.toFormData', () => {
    const FileForm = createForm<MyFiles>();
    function FileFormComponent({
      getFilesCallback,
      toFormDataCallback,
    }: {
      getFilesCallback: (fileList: FileList | null) => void;
      toFormDataCallback: (formData: FormData) => void;
    }) {
      const form = useForm(FileForm);
      const fileField = useFormFileField(FileForm, form.myFilesField);
      return (
        <>
          <input data-testid="myFilesField" {...fileField} />
          <button
            onClick={() => getFilesCallback(form.getFiles('myFilesField'))}
          >
            GET_FILES
          </button>
          <button onClick={() => toFormDataCallback(form.toFormData())}>
            TO_FORM_DATA
          </button>
        </>
      );
    }
    const file1 = new File([new Blob(['MOCK_FILE_TEXT_1'])], 'file1.txt', {
      type: 'text/plain',
    });
    const file2 = new File([new Blob(['MOCK_FILE_TEXT_2'])], 'file2.txt', {
      type: 'text/plain',
    });
    let getFilesResult: FileList | null = null;
    let toFormDataResult: FormData = new FormData();
    const getFilesCallback = (fileList: FileList | null) => {
      getFilesResult = fileList;
    };
    const toFormDataCallback = (formData: FormData) => {
      toFormDataResult = formData;
    };
    const { getByTestId, getByText } = render(
      <FileFormComponent
        getFilesCallback={getFilesCallback}
        toFormDataCallback={toFormDataCallback}
      />,
      {
        wrapper: ({ children }) => (
          <FileForm.Provider defaultValues={{ myFilesField: '', foo: 'bar' }}>
            {children}
          </FileForm.Provider>
        ),
      },
    );
    act(() => {
      fireEvent.change(getByTestId('myFilesField'), {
        target: { files: [file1, file2], value: 'file1.txt' },
      });
    });
    act(() => {
      fireEvent.click(getByText('GET_FILES'));
    });
    expect(getFilesResult).toEqual([file1, file2]);

    act(() => {
      fireEvent.click(getByText('TO_FORM_DATA'));
    });
    expect(toFormDataResult.get('myFilesField')).toEqual('file1.txt,file2.txt');
  });
});
