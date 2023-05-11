import { makeField } from '../makeField';
import { Primitive } from '../types';

type TestCaseControlled = {
  value: Primitive;
  name: string;
  onChange: () => Primitive;
};

function makeChangeEvent(value: Primitive) {
  if (typeof value === 'boolean') {
    return {
      target: { checked: value },
    } as React.ChangeEvent<HTMLInputElement>;
  }
  return { target: { value } } as React.ChangeEvent<HTMLInputElement>;
}

describe('makeField', () => {
  describe('controlled fields', () => {
    test.each<TestCaseControlled>([
      {
        name: 'string',
        value: 'abc123',
        onChange: () => '',
      },
      {
        name: 'number',
        value: 1,
        onChange: () => 1,
      },
    ])('should make fields for type="$name"', ({ name, value, onChange }) => {
      const result = makeField(name, value, onChange);
      expect(result).toMatchObject({
        id: name,
        name,
        value,
      });
      expect(() => result.onChange(makeChangeEvent(value))).not.toThrowError();
    });
    test('should make fields for boolean types', () => {
      const result = makeField('name', true, () => false);
      expect(result).toMatchObject({
        id: 'name',
        name: 'name',
        checked: true,
      });
      expect(() => result.onChange(makeChangeEvent(false))).not.toThrowError();
    });
  });
});
