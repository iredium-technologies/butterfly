import { Event } from '~/src/events/event'
import { ListenerInterface } from '~/src/listeners/listener_interface'

export abstract class BaseListener implements ListenerInterface {
  public abstract handle (payload: Event): void;
}
