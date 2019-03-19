import mongoose = require('mongoose')

export var Schema = new mongoose.Schema({
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
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options): object {
      delete ret.password
      delete ret.__v
      return ret
    }
  },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
