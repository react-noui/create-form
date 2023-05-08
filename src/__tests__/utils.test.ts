import { isFileList } from 'utils';

const blob = new Blob([''], { type: 'text/html' });
const file = <File>blob;
const fileList = {
  0: file,
  length: 1,
  item: () => file,
};

describe('isFileList', () => {
  test.each<{
    fileList: FileList | null;
    expected: boolean;
  }>([
    {
      fileList: null,
      expected: false,
    },
    {
      fileList,
      expected: true,
    },
  ])('determines isFileList', ({ fileList, expected }) => {
    expect(isFileList(fileList)).toBe(expected);
  });
});
