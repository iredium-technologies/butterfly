import * as c from '~/example/controllers'

export function routes (route): void {
  route.resources('/users', c.UsersController)
}
