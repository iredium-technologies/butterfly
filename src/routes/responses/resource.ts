import { BaseResponse } from '~/src/routes/responses/base_response'
import express = require('express')
import { BaseSerializer } from '~/src/serializers/base_serializer'

export class ResourceResponse extends BaseResponse {
  protected serializer: BaseSerializer;

  public constructor (serializer) {
    super()
    this.serializer = serializer
  }

  public render (res: express.Response): void {
    const json = this.serializer.toJSON()

    if (Array.isArray(json)) {
      res.json({
        apiVersion: process.env.API_VERSION || '1.0',
        ...this.serializer.meta,
        data: {
          pagination: this.serializer.pagination,
          items: json
        }
      })
    } else {
      res.json({
        apiVersion: process.env.API_VERSION || '1.0',
        ...this.serializer.meta,
        data: json
      })
    }
  }
}
