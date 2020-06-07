import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import uuid = require('node-uuid')
import express = require('express')

export class RequestId extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      const clientTraceId = req.get('x-client-trace-id')
      req['locals'].requestId = clientTraceId || req.get('x-request-id') || uuid.v4()
      req.headers['requestId'] = req['locals'].requestId
      next()
    }
  }
}
