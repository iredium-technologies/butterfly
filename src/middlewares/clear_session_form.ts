import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import express = require('express')

export class ClearSessionForm extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      res.once('finish', () => {
        const session = req['session']
        if (session) {
          session['form'] = null
        }
      })
      next()
    }
  }
}
