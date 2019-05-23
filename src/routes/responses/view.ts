import { BaseResponse } from '~/src/routes/responses/base_response'
import express = require('express')

export class ViewResponse extends BaseResponse {
  protected path: string
  protected data: object

  public constructor (path, data = {}) {
    super()
    this.path = path
    this.data = data
  }

  public render (res: express.Response): void {
    res.render(this.path, this.data)
  }
}
