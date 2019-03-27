import { BaseError } from '~/src/errors/base_error'

export class NotFoundError extends BaseError {
  public constructor (message = 'Not found', payload = {}) {
    super('Not Found', message, 404, payload)
  }
}
