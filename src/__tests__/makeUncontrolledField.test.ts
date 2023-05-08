import { makeUncontrolledField } from 'makeUncontrolledField';
import { Primitive } from 'types';

type TestCaseControlled = {
  defaultValue: Primitive;
  name: string;
};

describe('makeField', () => {
  describe('controlled fields', () => {
    test.each<TestCaseControlled>([
      {
        name: 'string',
        defaultValue: 'abc123',
      },
      {
        name: 'number',
        defaultValue: 1,
      },
    ])('should make fields for type="$name"', ({ name, defaultValue }) => {
      const result = makeUncontrolledField(name, defaultValue);
      expect(result).toMatchObject({
        id: name,
        name,
        defaultValue,
      });
    });
    test('should make fields for boolean types', () => {
      const result = makeUncontrolledField('name', true);
      expect(result).toMatchObject({
        id: 'name',
        name: 'name',
        defaultChecked: true,
      });
    });
  });
});
