import { useCallback } from 'react';

import { createForm } from 'createForm';
import { useForm, useFormFileField } from 'hooks/controlled';
import { isFileList } from 'utils';

export default { title: 'forms/FileListForm' };

type FileListForm = {
  myFileField: string;
  foo: string;
};

const DEFAULT_LOGIN: FileListForm = {
  myFileField: '',
  foo: '',
};

const FileListForm = createForm<FileListForm>();

function withFileListForm() {
  return (
    <FileListForm.Provider defaultValues={DEFAULT_LOGIN}>
      <FileListFormComponent />
    </FileListForm.Provider>
  );
}

function FileListFormComponent() {
  const form = useForm(FileListForm);
  const fileField = useFormFileField(FileListForm, form.myFileField);

  const handleSubmit = useCallback(() => {
    const files = form.getFiles('myFileField');
    const data = form.toFormData();
    if (!isFileList(files)) return;
    data.delete('myFileField');
    for (let i = 0; i < files.length; i++) {
      data.append('myFileFiled', files[i]);
    }
    fetch('upload/file', { method: 'POST', body: data });
  }, [form]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', width: 500, gap: 8 }}
    >
      <label htmlFor={fileField.name}>
        Select files to upload: {form.myFileField.value}
      </label>
      <input multiple {...fileField} />
      <input {...form.foo} />
      <button onClick={() => form.resetAll()}>Reset</button>
      <button onClick={handleSubmit}>Submit</button>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
}

export const fileListForm = () => withFileListForm();
