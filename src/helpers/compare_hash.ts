import bcrypt = require('bcrypt')

export function compareHash (plainString, hashedString): Promise<boolean> {
  return new Promise((resolve, reject): void => {
    console.log({plainString, pass: hashedString})
    bcrypt.compare(plainString, hashedString, (err, isMatch): void => {
      if (err) {
        reject(isMatch)
      } else {
        resolve(isMatch)
      }
    })
  })
}
