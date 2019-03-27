class ErrorJSON {
  public name: string
  public message: string
  public code: number
  public payload: object

  public constructor (name: string, message: string, code: number, payload: object) {
    this.name = name
    this.message = message
    this.code = code
    this.payload = payload
  }
}

export class BaseError extends Error {
  protected code: number
  protected payload: object

  public constructor (name: string, message: string = '', code: number = 500, payload: object = {}) {
    super(message)
    this.name = name
    this.message = message
    this.code = code
    this.payload = payload
    this.stack = (new Error(message)).stack
  }

  public static toJSON (error: BaseError): object {
    const json: ErrorJSON = new ErrorJSON(
      error.name,
      error.message,
      error.code,
      error.payload
    )
    return json
  }

  public static toString (error: BaseError): string {
    return JSON.stringify(BaseError.toJSON(error))
  }
}
