import { controllerHandler as c } from '~/src/routes/controller_handler'

export function handle (Controller, action): Function {
  const controller = new Controller()
  return c(controller, action)
}
