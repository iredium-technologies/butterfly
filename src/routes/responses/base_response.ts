import { ResponseInterface } from './response_interface'
import express = require('express')

export abstract class BaseResponse implements ResponseInterface {
  public statusCode
  public cookieArgs

  public constructor () {
    this.statusCode = 200
  }

  public status (status): BaseResponse {
    this.statusCode = status
    return this
  }

  public cookie (...args): BaseResponse {
    this.cookieArgs = args
    return this
  }

  public executeRender (res: express.Response): void {
    res.status(this.statusCode)
    this.render(res)
  }

  public abstract render(res: express.Response): void;
}
