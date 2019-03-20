import { UserInterface as Interface } from '~/src/models/user/interface'
import { Schema } from '~/src/models/user/schema'
import bcrypt from 'bcrypt'
import { hashPassword } from '~/src/helpers/hash_password'
import mongoose = require('mongoose')

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
  return new Promise((resolve, reject): void => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch): void => {
      if (err) {
        reject(err)
      } else {
        resolve(isMatch)
      }
    })
  })
}

Schema.pre('save', function (next): void {
  this.wasNew = true
  next()
})

Schema.pre('save', function (next): void {
  const user = this
  const password = user.password
  if (!user.isModified('password')) return next()
  hashPassword(password)
    .then((hash): void => {
      user.password = hash
      next()
    })
    .catch((err): void => {
      next(err)
    })
})

export const User: mongoose.Model<Interface> = mongoose.model<Interface>('User', Schema)
