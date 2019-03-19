import * as crypto from 'crypto'

const algorithm = 'aes-256-ctr'

export class Crypto {
  public static encrypt (text: string): string {
    var cipher = crypto.createCipher(algorithm, process.env.IREDIUM_CRYPTO_PASSWORD)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  }

  public static decrypt (text: string): string {
    var decipher = crypto.createDecipher(algorithm, process.env.IREDIUM_CRYPTO_PASSWORD)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  }
}
