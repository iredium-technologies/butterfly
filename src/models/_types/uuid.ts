import mongoose = require('mongoose');
import bson = require('bson');
import util = require('util');
import uuid = require('uuid');
import { base62 } from '~/src/helpers/encoding';

export function getter(binary) {
  if (binary == null) return undefined;
  // @ts-ignore
  if (!(binary instanceof mongoose.Types.Buffer.Binary)) {
    console.log({ location: 'uuid getter', 'notBinary': true })
    return binary;
  }

  const resultString = base62.encode(binary.buffer)

  return resultString
}

function SchemaUUID(path, options) {
  // @ts-ignore
  mongoose.SchemaTypes.Buffer.call(this, path, options);

  // @ts-ignore
  this.getters.push(getter);
}

util.inherits(SchemaUUID, mongoose.SchemaTypes.Buffer);

SchemaUUID.schemaName = 'UUID';

SchemaUUID.prototype.checkRequired = function(value) {
  // @ts-ignore
  return value instanceof mongoose.Types.Buffer.Binary;
};

SchemaUUID.prototype.cast = function(value, doc, init) {
  // @ts-ignore
  if (value instanceof mongoose.Types.Buffer.Binary) return value;

  if (typeof value === 'string') {
    const buf = uuid.parse(value)

    var uuidBuffer = new mongoose.Types.Buffer(buf);

    uuidBuffer.subtype(bson.Binary.SUBTYPE_UUID);

    return uuidBuffer.toObject();
  }

  throw new Error('Could not cast ' + value + ' to UUID.');
};

SchemaUUID.prototype.castForQuery = function($conditional, val) {
  var handler;

  if (arguments.length === 2) {
    handler = this.$conditionalHandlers[$conditional];

    if (!handler) {
      throw new Error("Can't use " + $conditional + " with UUID.");
    }

    return handler.call(this, val);
  }

  return this.cast($conditional);
};

export function registerType (mongoose) {
  mongoose.Types.UUID = mongoose.SchemaTypes.UUID = SchemaUUID;
}

export const UUID = SchemaUUID
