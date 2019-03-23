import * as c from '~/example/controllers'
import { handle } from '~/src/routes/handle'

export function routes (route): void {
  route.get('/me', handle(c.UsersController, 'me'))
  route.resources('/users', c.UsersController)
  route.resources('/tasks', c.TasksController)
}
