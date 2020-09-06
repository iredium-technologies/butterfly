import { BaseResponse } from '~/src/routes/responses/base_response'
import express = require('express')
import uuid = require('uuid')

function stringifyUUID (data): void {
  if (Array.isArray(data)) {
    for (let item of data) {
      stringifyUUID(item)
    }
  } else if (typeof data === 'object') {
    Object.keys(data).forEach((key): void => {
      if (key === 'uuid') {
        data[key] = uuid.stringify(data[key])
      } else {
        stringifyUUID(data[key])
      }
    })
  }
}

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
    stringifyUUID(data)
    return this.format ? {
      data,
      meta: {
        http_status: this.statusCode,
        ...meta
      }
    } : data
  }
}
