/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import { Module } from './module.decorator.v2';

describe('Module Decorator', () => {
  it('should define module metadata', () => {
    class TestModel {}
    @Module({
      imports: [],
      exports: [],
      providers: [],
      controllers: [],
      model: TestModel,
    })
    class TestModule {}

    const moduleMetadata = Reflect.getMetadataKeys(TestModule);

    expect(moduleMetadata).toEqual(['imports', 'exports', 'providers', 'controllers', 'model']);
  });

  it('should throw an error if module options are invalid', () => {
    expect(() => {
      @Module({ invalidKey: 'invalidValue' } as any)
      class InvalidModule {}
    }).toThrowError();
  });
});
