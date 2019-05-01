import * as crypto from 'crypto'

const DEFAULT_ALGORITHM = 'aes-256-ctr'

export class Crypto {
  public static encrypt (text: string, algorithm = DEFAULT_ALGORITHM): string {
    const cryptoPassword: string = process.env.IREDIUM_CRYPTO_PASSWORD || ''
    var cipher = crypto.createCipher(algorithm, cryptoPassword)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  }

  public static decrypt (text: string, algorithm = DEFAULT_ALGORITHM): string {
    const cryptoPassword: string = process.env.IREDIUM_CRYPTO_PASSWORD || ''
    var decipher = crypto.createDecipher(algorithm, cryptoPassword)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  }
}
