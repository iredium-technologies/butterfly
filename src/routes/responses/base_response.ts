import { ResponseInterface } from './response_interface'

export abstract class BaseResponse implements ResponseInterface {
  public statusCode

  public constructor () {
    this.statusCode = 200
  }

  public status (status): BaseResponse {
    this.statusCode = status
    return this
  }

  public abstract render();
}
