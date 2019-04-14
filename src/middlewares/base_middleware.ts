import express = require('express')
import { Class } from '~/src/types/class';
import { UserService } from '~/src/services'

export abstract class BaseMiddleware {
  public abstract generate (): express.RequestHandler
  protected userServiceClass: Class

  public constructor (userServiceClass: Class = UserService) {
    this.userServiceClass = userServiceClass
  }

  public handleMiddelware (): express.RequestHandler {
    return (req, res, next): void => {
      const middleware = this.generate()
      middleware(req, res, next)
        .catch((e) => {
          next(e)
        })
    }
  }

  public setUserServiceClass (userServiceClass: Class): void {
    this.userServiceClass = userServiceClass
  }
}
