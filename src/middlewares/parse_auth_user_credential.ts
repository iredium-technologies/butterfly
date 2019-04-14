import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import express = require('express')

export class ParseAuthUserMiddleware extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      const users = new this.userServiceClass()
      const scopesString = req.get('X-Authenticated-Scope')
      const scopes = scopesString ? scopesString.split(' ') : []
      const userId = req.get('X-Authenticated-Userid')
      let user = null
      if (userId) user = await users.get(userId)
      req['user'] = user
      req['authInfo'] = { scopes }
      next()
    }
  }
}
