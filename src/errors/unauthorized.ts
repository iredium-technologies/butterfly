import { BaseError } from '~/src/errors/base_error'

export class UnauthorizedError extends BaseError {
  public constructor (message = 'Unauthorized', payload = null) {
    super('Unauthorized', message, 403, payload)
  }
}
