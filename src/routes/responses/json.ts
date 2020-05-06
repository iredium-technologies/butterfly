import { BaseResponse } from '~/src/routes/responses/base_response'
import express = require('express')

export class JsonResponse extends BaseResponse {
  protected responseData = {}
  protected responseMeta = {}
  protected format = true

  public constructor (response, meta = {}, format = true) {
    super()
    this.responseData = response
    this.responseMeta = meta
    this.format = format
  }

  public render (res: express.Response): void {
    const json = this.toJSONResponse(this.responseData, this.responseMeta)
    res.json(json)
  }

  protected toJSONResponse (data, meta = {}): object {
    return this.format ? {
      data,
      meta: {
        http_status: this.statusCode,
        ...meta
      }
    } : data
  }
}
