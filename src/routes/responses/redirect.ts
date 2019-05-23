import { BaseResponse } from '~/src/routes/responses/base_response'
import express = require('express')

export class RedirectResponse extends BaseResponse {
  protected path: string

  public constructor (path) {
    super()
    this.statusCode = 302
    this.path = path
  }

  public render (res: express.Response): void {
    res.redirect(this.statusCode, this.path)
  }
}
