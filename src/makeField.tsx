import { ChangeEvent } from 'react';

import {
  ControlledBooleanField,
  ControlledNumberField,
  ControlledTextField,
  FormControlAlgo,
  Primitive,
} from './types';
import { isBoolean, isNumber } from './utils';

export function makeField<V extends Primitive>(
  key: string,
  value: V,
  setter: (next: V) => void,
) {
  return makeControlledField(key, value, setter);
}

function makeControlledField<V extends Primitive>(
  key: string,
  value: V,
  setter: (next: V) => void,
): FormControlAlgo<V>;
function makeControlledField<V extends Primitive>(
  key: string,
  value: V,
  setter: (next: V) => void,
) {
  if (isBoolean(value)) {
    return makeControlledBooleanField(key, value, setter);
  }
  if (isNumber(value)) {
    return makeControlledNumberField(key, value, setter);
  }
  return makeControlledTextField(key, value, setter);
}

function makeControlledBooleanField(
  key: string,
  checked: boolean,
  setter: (next: any) => void,
): ControlledBooleanField {
  return {
    ...defaultFields(key),
    checked,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.checked);
    },
  };
}
function makeControlledTextField(
  key: string,
  value: string,
  setter: (next: any) => void,
): ControlledTextField {
  return {
    ...defaultFields(key),
    value,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    },
  };
}
function makeControlledNumberField(
  key: string,
  value: number,
  setter: (next: any) => void,
): ControlledNumberField {
  return {
    ...defaultFields(key),
    value,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(parseInt(event.target.value));
    },
  };
}

function defaultFields(key: string) {
  return {
    id: key,
    name: key,
  };
}
