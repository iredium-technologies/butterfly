import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import express = require('express')

export class ClearSessionError extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      res.once('finish', () => {
        const session = req['session']
        if (session) {
          session['error'] = null
        }
      })
      next()
    }
  }
}
