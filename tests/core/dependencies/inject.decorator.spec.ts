import 'reflect-metadata';

describe('InjectDecorator', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let targetClass: any;

  beforeAll(async () => {
    targetClass = new Map();
  });

  test('First test', () => {
    expect(1 + 1).toEqual(2);
  });
});
