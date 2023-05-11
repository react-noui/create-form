import { useContext } from 'react';

import { PrimitiveRecord, CreateForm } from '../types';

export function useForm<T extends PrimitiveRecord>(form: CreateForm<T>) {
  return useContext(form.Context);
}
