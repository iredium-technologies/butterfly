import { Document } from 'mongoose'

export interface BaseModelInterface extends Document {
  _id: string;
  getRouteKeyName(): string;
}
