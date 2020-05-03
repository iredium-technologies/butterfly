import { BaseError } from '~/src/errors/base_error'

export class UnauthenticatedError extends BaseError {
  public constructor (message = 'Unauthenticated', payload = {}) {
    super('Unauthenticated', message, 401, payload)
  }
}
