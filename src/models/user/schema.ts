import { BaseSchema } from '~/src/models/base_schema'

export var Schema = new BaseSchema({
  role: { type: String, default: 'standard', protect: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    protect: true
  }
})
