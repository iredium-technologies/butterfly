import mongoose = require('mongoose');
import bson = require('bson');
import util = require('util');
import uuidParse = require('uuid-parse');

function getter(binary) {
  console.log({location: 'uuid getter'})
  if (binary == null) return undefined;
  if (!(binary instanceof mongoose.Types.Buffer.Binary)) return binary;

  var len = binary.length();
  var b = binary.read(0,len);
  var buf = new Buffer(len);
  var hex = '';

  for (var i = 0; i < len; i++) {
    buf[i] = b[i];
  }

  for (var i = 0; i < len; i++) {
    var n = buf.readUInt8(i);

    if (n < 16){
      hex += '0' + n.toString(16);
    } else {
      hex += n.toString(16);
    }
  }

  const stringResult = hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);

  console.log({location: 'uuid getter', stringResult})

  return stringResult
}

function SchemaUUID(path, options) {
  mongoose.SchemaTypes.Buffer.call(this, path, options);

  this.getters.push(getter);
}

util.inherits(SchemaUUID, mongoose.SchemaTypes.Buffer);

SchemaUUID.schemaName = 'UUID';

SchemaUUID.prototype.checkRequired = function(value) {
  return value instanceof mongoose.Types.Buffer.Binary;
};

SchemaUUID.prototype.cast = function(value, doc, init) {
  if (value instanceof mongoose.Types.Buffer.Binary) return value;

  if (typeof value === 'string') {
    var uuidBuffer = new mongoose.Types.Buffer(uuidParse.parse(value));

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

export function registerTypeUUID (mongoose) {
  mongoose.Types.UUID = mongoose.SchemaTypes.UUID = SchemaUUID;
}

export const UUID = SchemaUUID
