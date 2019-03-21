import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import express = require('express')

export class ParseAuthUserMiddleware extends BaseMiddleware {
  public static default (UserServiceClass): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      const User = new UserServiceClass()
      const scopesString = req.get('X-Authenticated-Scope')
      const scopes = scopesString ? scopesString.split(' ') : []
      const userId = req.get('X-Authenticated-Userid')
      let user = null
      if (userId) user = await User.get(userId)
      req['user'] = user
      req['authInfo'] = { scopes }
      next()
    }
  }
}
