export const isFileList = (fileList: FileList | null): fileList is FileList => (fileList || []).length > 0;
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
export const isNumber = (value: any): value is number => typeof value === 'number';
