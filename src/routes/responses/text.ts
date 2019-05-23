import { BaseResponse } from '~/src/routes/responses/base_response'
import express = require('express')

export class TextResponse extends BaseResponse {
  protected text: string

  public constructor (text) {
    super()
    this.text = text
  }

  public render (res: express.Response): void {
    res.type('text/plain')
    res.send(this.text)
  }
}
