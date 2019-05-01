import bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10

function hashCallback (resolve, reject): Function {
  return function (err, hash): void {
    if (err) return reject(err)
    resolve(hash)
  }
}

function genSaltCallback (plainString, resolve, reject): Function {
  return function (err, salt): void {
    if (err) return reject(err)
    bcrypt.hash(plainString, salt, hashCallback(resolve, reject))
  }
}

export const hashString = (plainString): Promise<string> => {
  return new Promise((resolve, reject): void => {
    bcrypt.genSalt(SALT_WORK_FACTOR, genSaltCallback(plainString, resolve, reject))
  })
}

export function compareStringToHash (plainString, hashedString): Promise<boolean> {
  return new Promise((resolve, reject): void => {
    bcrypt.compare(plainString, hashedString, (err, isMatch): void => {
      if (err) {
        reject(isMatch)
      } else {
        resolve(isMatch)
      }
    })
  })
}
