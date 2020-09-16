import { MongooseDocument } from "mongoose";

export class BaseSerializer {
  protected model: MongooseDocument | MongooseDocument[];
  public meta;
  public pagination;

  public constructor ({ model, meta = {}, pagination = {} }) {
    this.model = model
    this.meta = meta
    this.pagination = pagination
  }

  public toJSON (): object {
    if (Array.isArray(this.model)) {
      return this.model.map((m): object => m.toJSON())
    }

    return this.model.toJSON()
  }
}
