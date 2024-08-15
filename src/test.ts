function LogParameter(target: any, propertyKey: string | symbol, parameterIndex: number) {
  console.log(`Parameter in method ${String(propertyKey)} at index ${parameterIndex}`);
}

class MyClass {
  constructor(
    @LogParameter public name: string,
    @LogParameter public age: number,
  ) {}
}
