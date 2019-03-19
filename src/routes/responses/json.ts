import { BaseResponse } from '~/src/routes/responses/base_response'

export class JsonResponse extends BaseResponse {
  public constructor (response, meta = {}) {
    super(response)
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
}
