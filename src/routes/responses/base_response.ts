import { ResponseInterface } from './response_interface'
import express = require('express')

export abstract class BaseResponse implements ResponseInterface {
  public statusCode
  public cookieArgs: (string|number|object)[]

  public constructor () {
    this.statusCode = 200
    this.cookieArgs = []
  }

  public status (status): BaseResponse {
    this.statusCode = status
    return this
  }

  public cookie (name: string, ...args): BaseResponse {
    this.cookieArgs.push([name, ...args])
    return this
  }

  public executeRender (res: express.Response): void {
    res.status(this.statusCode || 200)
    for (let cookieArg of this.cookieArgs) {
      res.cookie(...cookieArg as [string, (string|number|object)])
    }
    this.render(res)
  }

  public abstract render(res: express.Response): void;
}
