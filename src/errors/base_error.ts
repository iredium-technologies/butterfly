export class BaseError extends Error {
  protected code
  protected payload

  public constructor (name = null, message = null, code = 500, payload = {}) {
    super(message)
    this.name = name
    this.message = message
    this.code = code
    this.payload = payload
    this.stack = (new Error(message)).stack
  }

  public static toJSON (error): object {
    const json = {
      name: error.name,
      message: error.message,
      code: error.code
    }
    if (error.payload) json['payload'] = error.payload
    return json
  }

  public static toString (error): String {
    return JSON.stringify(BaseError.toJSON(error))
  }
}
