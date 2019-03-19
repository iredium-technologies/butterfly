import { BaseEvent } from '~/src/events/base_event'

export interface ListenerInterface {
  handle (event: BaseEvent): void;
}
