import express = require('express')

export class BaseMiddleware {
  public static default (UserServiceClass?): express.RequestHandler {
    return (req, res, next): void => {
      next()
    }
  }
}
