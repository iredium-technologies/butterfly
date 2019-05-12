import { EventListener } from '~/src/types/config';

export const eventListenerMap: EventListener[] = [
  {
    event: () => import('~/src/events/users/created'),
    listeners: [
      () => import('../listeners/users/created/say_hello')
    ]
  }
]
