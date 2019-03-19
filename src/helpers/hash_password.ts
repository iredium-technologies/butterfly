import bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10

function hashCallback (resolve, reject): Function {
  return function (err, hash): void {
    if (err) return reject(err)
    resolve(hash)
  }
}

function genSaltCallback (password, resolve, reject): Function {
  return function (err, salt): void {
    if (err) return reject(err)
    bcrypt.hash(password, salt, hashCallback(resolve, reject))
  }
}

export const hashPassword = (password): Promise<string> => {
  return new Promise((resolve, reject): void => {
    bcrypt.genSalt(SALT_WORK_FACTOR, genSaltCallback(password, resolve, reject))
  })
}
