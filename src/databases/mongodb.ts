import mongoose = require('mongoose')
import { Database } from './database'

let connection: mongoose.Connection | null = null

export class MongoDb extends Database {
  public name = 'mongoDb'

  public async connect (): Promise<void> {
    if (!connection) {
      const {
        host,
        port,
        database,
        username,
        password
      } = this.config

      // Set up default mongoose connection
      const path = `${host}:${port}/${database}`
      const schema = username && password ? `mongodb://${username}:${password}@` : 'mongodb://'
      const mongoConn = `${schema}${path}?authSource=admin`

      mongoose.Promise = global.Promise
      mongoose.set('useCreateIndex', true)
      mongoose.set('debug', this.debug)

      // Get the default connection
      connection = mongoose.connection

      // Bind connection to error event (to get notification of connection errors)
      connection.on('error', (err): void => {
        console.error('MongoDB connection error: ' + err) // eslint-disable-line no-console
        process.exit(1)
      })

      mongoose.connect(mongoConn, { useNewUrlParser: true })
    }

    this.adapter = mongoose
    this.connection = connection
  }

  public async close (): Promise<void> {
    await this.adapter.connection.close()
    this.connection = null
    connection = null
  }
}
