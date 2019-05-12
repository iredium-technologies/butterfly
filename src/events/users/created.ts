import { Event } from '~/src/events/event'

export class UserCreatedEvent extends Event {
  public name: string = 'user_created_event'
  public user

  public constructor (user) {
    super()
    this.user = user
  }
}
