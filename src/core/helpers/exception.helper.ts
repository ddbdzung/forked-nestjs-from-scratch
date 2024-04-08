interface IExceptionData {
  name: string
  message: string
}

export class SystemException extends Error {
  public override readonly name = 'SystemException'
  public readonly innerError?: unknown
  private readonly _stack?: string

  constructor(message: string, innerError?: unknown) {
    super(message)
    this.innerError = innerError
    if (innerError instanceof Error) {
      this.message = `(${message}): ${innerError.message}`
      this._stack = innerError.stack
    } else {
      this.message = message
      this._stack = new Error().stack
    }
  }

  public override toString(): string {
    return `${this.name}: ${this.message}`
  }

  public toJSON(): IExceptionData {
    return {
      name: this.name,
      message: this.message,
    }
  }
}
