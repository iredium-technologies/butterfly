import { UserService } from '~/src/services/user'
import { routes } from '~/example/config/routes'
import { databases } from '~/example/config/databases'
import { eventListenerMap } from '~/example/config/event_listener_map'

export default {
  userServiceClass: UserService,
  routes,
  databases,
  modules: [
    () => import('~/example/modules/demo')
  ],
  eventListenerMap,
  env: {}
}
