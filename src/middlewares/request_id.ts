import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import uuid = require('node-uuid')
import express = require('express')

export class RequestId extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      req['request_id'] = req.headers['x-request-id'] || uuid.v4()
      next()
    }
  }
}
