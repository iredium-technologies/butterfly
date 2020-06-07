import express = require('express')

export abstract class BaseMiddleware {
  protected moduleName: string
  protected abstract generate (ctx: object): express.RequestHandler

  public constructor ({ moduleName = 'default' } = {}) {
    this.moduleName = moduleName
  }

  public handleMiddelware (ctx = {}): express.RequestHandler {
    const moduleName = this.moduleName
    const middlewareClassName = this.constructor.name
    return (req, res, next): void => {
      const timingMark = req['locals']['timingMark']
      timingMark[`${moduleName}:middlewares:${middlewareClassName}:start`] = process.hrtime()

      function handlerNext (e) {
        timingMark[`${moduleName}:middlewares:${middlewareClassName}:end`] = process.hrtime()
        next(e)
      }

      const middleware = this.generate(ctx)
      const promise = middleware(req, res, handlerNext)
      if (promise && promise.catch) {
        promise.catch((e) => {
          handlerNext(e)
        })
      }
    }
  }
}
