import { BaseEvent } from '~/src/events/base_event'
import { ListenerInterface } from '~/src/listeners/listener_interface'

export abstract class BaseListener implements ListenerInterface {
  public abstract handle (payload: BaseEvent): void;
}
