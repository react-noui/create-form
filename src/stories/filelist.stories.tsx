import { createForm } from 'createForm';
import { useForm, useFormFileField } from 'hooks/controlled';

export default { title: 'forms/FileListForm' };

type FileListForm = {
  myFileField: string;
};

const DEFAULT_LOGIN: FileListForm = {
  myFileField: '',
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

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', width: 500, gap: 8 }}
    >
      <label htmlFor={fileField.name}>Select files to upload</label>
      <input type="file" multiple {...fileField} />
      <button onClick={() => form.resetAll()}>Reset</button>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
}

export const fileListForm = () => withFileListForm();
