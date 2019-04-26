import bcrypt = require('bcrypt')

export function compareHash (plainString, hashedString): Promise<boolean> {
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
