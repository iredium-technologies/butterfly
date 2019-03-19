import { BaseEvent } from '~/src/events/base_event'
import * as events from '~/src/events'
import * as listeners from '~/src/listeners'
import Events = require('events')

export class Emitter {
  public event: Events

  public constructor () {
    this.event = new Events()
  }

  public register (Event: string, Listeners: string[]): void {
    const event = new events[Event]()
    for (let index in Listeners) {
      const Listener = Listeners[index]
      const listener = new listeners[Listener]()
      this.event.on(event.name, ($event): void => {
        listener.handle($event)
      })
      console.log(`Added ${listener} to ${event.name}`)
    }
  }

  public emit (event: BaseEvent): void {
    this.event.emit(event.name, event)
  }
}

const defaultInstance = new Emitter()

export default defaultInstance
