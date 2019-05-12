import { Event } from '~/src/events/event'

export interface ListenerInterface {
  handle (event: Event): void;
}
