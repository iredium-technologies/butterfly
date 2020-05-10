import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import express = require('express')

export class ReqLocals extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, _res, next): Promise<void> => {
      req['locals'] = {}
      next()
    }
  }
}
