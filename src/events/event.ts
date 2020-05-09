import { EventEmitter } from 'events'
import { EventInterface } from './event_interface'

const event = new EventEmitter()

export abstract class Event implements EventInterface {
  public abstract name: string

  public static on (name: string, handler): void {
    event.on(name, handler)
  }

  public static emit (e: Event): void {
    event.emit(e.name, e)
  }
}
