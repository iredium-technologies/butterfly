import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import express = require('express')
import jwt = require('jsonwebtoken');
import { ParseAuthenticatedUserJwtError } from '../errors';

const headerScopeName = 'X-Authenticated-Scope'
const headerAuthenticatedUserName = 'X-Authenticated-User'

export class ParseAuthUserMiddleware extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      const user = req.get(headerAuthenticatedUserName) ? this.parseAuthenticatedUserJwt(req) : null
      const scopesString = req.get(headerScopeName)
      const scopes = scopesString ? scopesString.split(' ') : []
      req['locals']['user'] = user
      req['locals']['authInfo'] = { scopes }
      next()
    }
  }

  protected parseAuthenticatedUserJwt (req): object {
    try {
      const jwtSecret = req.app.locals.config.env['JWT_SECRET']
      const authenticatedUserStr = jwt.verify(req.get(headerAuthenticatedUserName), jwtSecret);
      const authenticatedUser = JSON.parse(authenticatedUserStr)
      return authenticatedUser
    } catch (e) {
      throw new ParseAuthenticatedUserJwtError(e.message, {
        headers: {
          [headerAuthenticatedUserName]: req.get(headerAuthenticatedUserName),
          [headerScopeName]: req.get(headerScopeName)
        }
      })
    }
  }
}
