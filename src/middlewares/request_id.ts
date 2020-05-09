import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import uuid = require('node-uuid')
import express = require('express')

export class RequestId extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      res.locals.clientTraceId = req.get('x-client-trace-id')
      res.locals.requestId = req.get('x-request-id') || uuid.v4()
      next()
    }
  }
}
