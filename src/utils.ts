export function isFileList(fileList: FileList | null): fileList is FileList {
  return (fileList || []).length > 0;
}
