import { base62 } from '~/src/helpers/encoding';
import uuid = require('uuid')
import mongoose = require('mongoose')

const ID_LENGTH = 22

function ensureLength (input, targetLength): string {
  const inputLength = input.length
  if (inputLength < targetLength) {
    return `${'0'.repeat(targetLength - inputLength)}${input}`
  }
  return input
}

export class UUID {
  public static v4Base62 (): string {
    return base62.encode(uuid.parse(uuid.v4()))
  }

  // @ts-ignore
  public static bufferToBase62 (buffer: Buffer): string {
    const resultString = base62.encode(buffer)
    return ensureLength(resultString, ID_LENGTH)
  }

  public static stringToBuffer (uuidBase62: string): mongoose.Types.Buffer {
    if (uuidBase62.length > ID_LENGTH) {
      throw new Error(`Exceeded maximum length of ${ID_LENGTH}. Received uuidBase62 (length: ${uuidBase62.length}): ${uuidBase62.length > 30 ? `${uuidBase62.substr(0, 30)}***` : uuidBase62}`)
    }

    const decodedUUIDBuf = base62.decode(uuidBase62.replace(/^[0]*/,''))

    return new mongoose.Types.Buffer(decodedUUIDBuf);
  }
}
