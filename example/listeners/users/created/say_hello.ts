import { BaseListener } from '~/src/listeners'
import { UserCreatedEvent } from '~/src/events/users/created';

export class SayHello extends BaseListener {
  public handle (event: UserCreatedEvent): void {
    console.log({listened_event: event})
  }
}
