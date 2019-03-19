import { EventInterface } from '~/src/events/event_interface'

export abstract class BaseEvent implements EventInterface {
  public abstract name: string
}
