import { BaseSchema } from '~/src/models/base_schema'
import mongoose = require('mongoose')

export var Schema = new BaseSchema({
  user: { type: mongoose.Schema.Types.Buffer, ref: '_User', required: true, protect: true, autopopulate: { select: 'id username first_name last_name default_address email' } },
  title: { type: String, required: true },
  description: { type: String, required: false },
  complete: { type: Boolean, default: false }
})
