import express = require('express')

export class BaseMiddleware {
  public static default (): express.RequestHandler {
    return (req, res, next): void => {
      next()
    }
  }
}
