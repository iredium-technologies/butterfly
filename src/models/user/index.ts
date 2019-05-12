import { BaseSchema } from './../base_schema'
import { UserCreatedEvent } from '~/src/events/users/created'
import { UserInterface as Interface } from '~/src/models/user/interface'
import { Schema } from '~/src/models/user/schema'
import { hashPassword } from '~/src/helpers/hash_password'
import mongoose = require('mongoose')
import { compareHash } from '~/src/helpers'
import { Event } from '~/src/events'

Schema.methods.fullName = function (): string {
  return (this.firstName.trim() + ' ' + this.lastName.trim())
}

Schema.methods.isAdmin = function (): boolean {
  const roles = ['admin', 'root']
  return roles.includes(this.role)
}

Schema.methods.isRoot = function (): boolean {
  return this.role === 'root'
}

Schema.methods.comparePassword = function (candidatePassword): Promise<boolean> {
  return compareHash(candidatePassword, this.password)
}

Schema.pre('save', function (next): void {
  const user = this
  const password = user['password']
  if (!user.isModified('password')) return next()
  hashPassword(password)
    .then((hash): void => {
      user['password'] = hash
      next()
    })
    .catch((err): void => {
      next(err)
    })
})

Schema.post('save', function (this: BaseSchema) {
  const user = this
  if (user.wasNew) {
    Event.emit(new UserCreatedEvent(user))
  }
})

export const User: mongoose.Model<Interface> = mongoose.model<Interface>('_User', Schema)

export interface UserType extends mongoose.Model<Interface> {}
