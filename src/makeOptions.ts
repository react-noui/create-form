import {
  ControlledOptions,
  PrimitiveRecord,
  CreateFormOptions,
  CreateFormUncontrolledOptions,
  UncontrolledOptions,
} from 'types';

export function makeOptions<T extends PrimitiveRecord>(
  options?: CreateFormOptions<T>,
): ControlledOptions<T> {
  return {
    props: (options || {}).props || {},
    validate: (options || {}).validate || {},
  };
}

export function makeOptionsUncontrolled<T extends PrimitiveRecord>(
  options?: CreateFormUncontrolledOptions<T>,
): UncontrolledOptions<T> {
  return {
    props: (options || {}).props || {},
  };
}
