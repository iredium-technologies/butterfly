import { Class } from './../types/class';
import { controllerHandler as c } from '~/src/routes/controller_handler'

export function handle (Controller: Class, action): Function {
  return c(Controller, action)
}
