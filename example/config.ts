import { UserService } from '~/src/services/user'
import { routes } from '~/example/config/routes'
import { databases } from '~/example/config/databases'

export default {
  userServiceClass: UserService,
  routes,
  databases
}
