import mongoose = require('mongoose')

export function mongodb ({
  host = process.env.MONGO_HOST,
  port = process.env.MONGO_PORT,
  database = process.env.MONGO_DATABASE,
  username = process.env.MONGO_USERNAME,
  password = process.env.MONGO_PASSWORD
}): void {
  // Set up default mongoose connection
  const path = `${host}:${port}/${database}`
  const schema = username && password ? `mongodb://${username}:${password}@` : 'mongodb://'
  const mongoConn = `${schema}${path}?authSource=admin`

  mongoose.Promise = global.Promise
  mongoose.connect(mongoConn, { useNewUrlParser: true })
  mongoose.set('useCreateIndex', true)

  // Debug
  mongoose.set('debug', process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test')

  // Get the default connection
  var db = mongoose.connection

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', (err): void => {
    console.error('MongoDB connection error: ' + err) // eslint-disable-line no-console
    process.exit(1)
  })
}
