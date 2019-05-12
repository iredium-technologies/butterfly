import { Event } from '~/src/events/event'

export class UserCreatedEvent extends Event {
  public name: string = 'event:users:created'
  public user

  public constructor (user) {
    super()
    this.user = user
  }
}
