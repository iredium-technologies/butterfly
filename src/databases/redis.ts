import { Database } from "./database"
import redis = require('redis')

let connection = null

export class Redis extends Database {
  public name = 'redis'

  public get (key: string, callback: Function | null = null): Promise<void> {
    return new Promise((resolve, reject): void => {
      this.connection.get(key, function (err, reply) {
        if (callback) callback(err, reply)
        if (err) {
          reject(err)
        } else {
          resolve(reply ? reply.toString() : reply)
        }
      });
    })
  }

  public set (key, value, expireTimeInSecond = null, callback: Function | null = null): void {
    const args = [key, value]
    if (expireTimeInSecond) args.push('EX', expireTimeInSecond)
    if (callback) args.push(callback)
    this.connection.set(...args)
  }

  public connect (): void {
    const config = this.config
    if (!connection) {
      connection = redis.createClient({
        ...config,
        retry_strategy: function (options) {
          if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with
          // a individual error
            return new Error('The server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
          // End reconnecting with built in error
            return undefined;
          }
          // reconnect after
          return Math.min(options.attempt * 100, 3000);
        }
      })
    }
    this.adapter = redis
    this.connection = connection
  }

  public close (): void {
    this.connection.quit()
    this.connection = null
    connection = null
  }
}
