import { UserInterface } from '~/src/models/user/interface'

export interface NotificationInterface {
  name: string;
  via (user: UserInterface): string[];
}
