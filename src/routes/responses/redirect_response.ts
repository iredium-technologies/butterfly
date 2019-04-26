import { BaseResponse } from '~/src/routes/responses/base_response'

export class RedirectResponse extends BaseResponse {
  protected path: string

  public constructor (path) {
    super()
    this.statusCode = 302
    this.path = path
  }

  public async render (): Promise<(string)> {
    return this.path
  }
}
