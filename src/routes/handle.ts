import { controllerHandler as c } from '~/src/routes/controller_handler'

export function handle (Controller, action): void {
  const controller = new Controller()
  c(controller, action)
}
