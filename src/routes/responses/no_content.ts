import { BaseResponse } from '~/src/routes/responses/base_response'
import express = require('express')

export class NoContentResponse extends BaseResponse {
  protected responseData = {}
  protected responseMeta = {}
  protected format = true

  public render (res: express.Response): void {
    res.status(204).send()
  }
}
