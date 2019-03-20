import uuid = require('node-uuid')

export function requestId (req, res, next): void {
  req.request_id = req.headers['x-request-id'] || uuid.v4()
  next()
}
