import mongoose = require('mongoose')

export class BaseSchema extends mongoose.Schema {
  public statics
  public methods
  protected defaultRouteKeyName

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
    this.defaultRouteKeyName = '_id'
    this.registerCommonStatics()
    this.registerCommonMethods()
    this.registerCommonPres()
  }

  protected registerCommonStatics (): void {
    this.statics.getRouteKeyName = function (): string {
      return this.defaultRouteKeyName
    }
  }

  protected registerCommonMethods (): void {
    this.methods.getRouteKeyName = function (): string {
      return this.defaultRouteKeyName
    }
  }

  protected registerCommonPres (): void {

  }
}
