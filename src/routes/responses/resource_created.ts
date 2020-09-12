import { BaseResponse } from '~/src/routes/responses/base_response'
import express = require('express')

export class ResourceCreatedResponse extends BaseResponse {
  protected id

  public constructor (id) {
    super()
    this.id = id
  }

  public render (res: express.Response): void {
    res.status(201).json({
      apiVersion: process.env.API_VERSION || '1.0',
      data: {
        id: this.id
      }
    })
  }
}
