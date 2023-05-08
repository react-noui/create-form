import { makeOptions } from 'makeOptions';

describe('makeOptions', () => {
  test('defaults to controlled inputs', () => {
    expect(makeOptions()).toEqual({
      validate: {},
      props: {},
    });
  });
});
