import { NotificationInterface } from '~/src/notifiers/notification_interface'
import { UserInterface } from '~/src/models/user/interface'

export abstract class BaseNotification implements NotificationInterface {
  abstract name: string
  abstract via (user: UserInterface): string[]
}
