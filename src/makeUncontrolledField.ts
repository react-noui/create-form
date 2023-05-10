import {
  UncontrolledBooleanField,
  UncontrolledNumberField,
  UncontrolledTextField,
  FormUncontrolAlgo,
  Primitive,
} from 'types';

const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
const isNumber = (value: any): value is number => typeof value === 'number';

export function makeUncontrolledField<V extends Primitive>(
  key: string,
  value: V,
): FormUncontrolAlgo<V>;
export function makeUncontrolledField<V extends Primitive>(
  key: string,
  value: V,
) {
  if (isBoolean(value)) {
    return makeUncontrolledBooleanField(key, value);
  }
  if (isNumber(value)) {
    return makeUncontrolledNumberField(key, value);
  }
  return makeUncontrolledTextField(key, value);
}

function makeUncontrolledBooleanField(
  key: string,
  defaultChecked: boolean,
): UncontrolledBooleanField {
  return {
    ...defaultFields(key),
    defaultChecked,
  };
}
function makeUncontrolledTextField(
  key: string,
  defaultValue: string,
): UncontrolledTextField {
  return {
    ...defaultFields(key),
    defaultValue,
  };
}
function makeUncontrolledNumberField(
  key: string,
  defaultValue: number,
): UncontrolledNumberField {
  return {
    ...defaultFields(key),
    defaultValue,
  };
}

function defaultFields(key: string) {
  return {
    id: key,
    name: key,
  };
}
