import { BaseError } from '~/src/errors/base_error'

export class ParseAuthenticatedUserJwtError extends BaseError {
  public constructor (message = 'ParseAuthenticatedUserJwt', payload = {}) {
    super('ParseAuthenticatedUserJwt', message, 500, payload)
  }
}
