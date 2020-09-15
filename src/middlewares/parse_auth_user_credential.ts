import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import express = require('express')
import jwt = require('jsonwebtoken');
import { ParseAuthenticatedUserJwtError } from '../errors';
import { UUID } from '../helpers/uuid';

const headerScopeName = 'X-Authenticated-Scope'
const headerAuthenticatedUserName = 'X-Authenticated-User'

export class ParseAuthUserMiddleware extends BaseMiddleware {
  public generate (): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
      const scopesString = req.get(headerScopeName)
      const scopes = scopesString ? scopesString.split(' ') : []

      req['locals']['authInfo'] = { scopes }

      if (!req['locals']['user']) {
        const user = req.get(headerAuthenticatedUserName) ? this.parseAuthenticatedUserJwt(req) : null
        if (user && typeof user['id'] === 'string') {
          user['id'] = UUID.stringToBuffer(user['id'])
        }
        req['locals']['user'] = user
      }

      next()
    }
  }

  protected parseAuthenticatedUserJwt (req): object {
    try {
      const jwtSecret = req.app.locals.config.env['JWT_SECRET']
      const authenticatedUser = jwt.verify(req.get(headerAuthenticatedUserName), jwtSecret);
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
