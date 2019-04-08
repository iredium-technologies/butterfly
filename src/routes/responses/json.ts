import { BaseResponse } from '~/src/routes/responses/base_response'

export class JsonResponse extends BaseResponse {
  protected responseData = {}
  protected responseMeta = {}

  public constructor (response, meta = {}) {
    super()
    this.responseData = response
    this.responseMeta = meta
  }

  public render (): object {
    return this.toJSONResponse(this.responseData, this.responseMeta)
  }

  public data (data): BaseResponse {
    this.responseData = data
    return this
  }

  public meta (meta): BaseResponse {
    this.responseMeta = meta
    return this
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
