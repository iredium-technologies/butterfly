import mongoose = require('mongoose')

export interface BaseModelInterface extends mongoose.Document {
  _id: string;
  getRouteKeyName(): string;
}
