import mongoose = require('mongoose')

export class BaseSchema extends mongoose.Schema {
  public statics
  public methods

  public constructor (schema) {
    const baseOptions = {
      toObject: {
        virtuals: true
      },
      toJSON: {
        virtuals: true,
        transform: function (doc, ret, options): object {
          delete ret.password
          delete ret.__v
          return ret
        }
      },
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
    super(schema, baseOptions)
    this.registerCommonStatics()
    this.registerCommonMethods()
    this.registerCommonPres()
  }

  protected registerCommonStatics (): void {
    this.statics.getRouteKeyName = function (): string {
      return '_id'
    }
  }

  protected registerCommonMethods (): void {

  }

  protected registerCommonPres (): void {

  }
}
