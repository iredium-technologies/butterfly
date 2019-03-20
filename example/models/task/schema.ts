import { BaseSchema } from '~/src/models/base_schema'

export var Schema = new BaseSchema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  complete: { type: Boolean, default: false }
})
