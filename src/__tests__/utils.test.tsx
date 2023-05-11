import { isBoolean, isFileList, isNumber } from '../utils';

/**
 * TODO: This needs to build a FileList
 */
describe('isFileList', () => {
  const fileList = { length: 1 } as FileList;
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

  test.each<{
    bool: any;
    expected: boolean;
  }>([
    {
      bool: true,
      expected: true,
    },
    {
      bool: false,
      expected: true,
    },
    {
      bool: 1,
      expected: false,
    },
    {
      bool: 'hey',
      expected: false,
    },
  ])('determines isBoolean', ({ bool, expected }) => {
    expect(isBoolean(bool)).toBe(expected);
  });

  test.each<{
    num: any;
    expected: boolean;
  }>([
    {
      num: 1,
      expected: true,
    },
    {
      num: Infinity,
      expected: true,
    },
    {
      num: false,
      expected: false,
    },
    {
      num: 'hey',
      expected: false,
    },
  ])('determines isNumber', ({ num, expected }) => {
    expect(isNumber(num)).toBe(expected);
  });
});
