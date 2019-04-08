import { BaseResponse } from '~/src/routes/responses/base_response'

export class ViewResponse extends BaseResponse {
  protected path: string
  protected data: object

  public constructor (path, data = {}) {
    super()
    this.path = path
    this.data = data
  }

  public async render (): Promise<(object | string)[]> {
    return [this.path, this.data]
  }
}
