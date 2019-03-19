export class BaseResponse {
  public statusCode
  protected response
  protected responseData = {}
  protected responseMeta = {}

  public constructor (response) {
    this.response = response
    this.statusCode = 200
  }

  public status (status): BaseResponse {
    this.statusCode = status
    return this
  }

  public render (): object {
    return this.responseData
  }

  public async toJSONResponse (data, meta = {}): Promise<object> {
    return {
      data,
      meta: {
        http_status: this.statusCode,
        ...meta
      }
    }
  }
}
