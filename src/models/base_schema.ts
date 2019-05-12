import autopopulate = require('mongoose-autopopulate')
import mongoose = require('mongoose')

export class BaseSchema extends mongoose.Schema {
  public statics
  public methods
  public wasNew: boolean
  protected defaultRouteKeyName
  protected populateUser

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
    const combinedSchema = {
      ...schema,
      ...{
        deleted_at: { type: Date, default: null, protect: true },
        deleted_by: { type: String, default: null, hidden: true, protect: true }
      }
    }
    super(combinedSchema, baseOptions)
    this.wasNew = false
    this.populateUser = { select: 'id username first_name last_name default_address email' }
    this.defaultRouteKeyName = '_id'
    this.registerCommonStatics()
    this.registerCommonMethods()
    this.registerCommonPres()
    this.registerPlugins()
  }

  protected registerCommonStatics (): void {
    this.statics.getRouteKeyName = function (): string {
      return this.defaultRouteKeyName
    }
  }

  protected registerCommonMethods (): void {
    this.methods.getRouteKeyName = (): string => {
      return this.defaultRouteKeyName
    }

    this.methods.promisify = function promisify (method): Promise<void> {
      return new Promise((resolve, reject) => {
        this[method]((error, res) => {
          if (error) {
            reject(error)
          } else {
            resolve(res)
          }
        })
      })
    }

    this.methods.softDelete = async function softDelete (user): Promise<mongoose.Document> {
      try {
        this.set({ deleted_at: Date.now(), deleted_by: user ? user._id : null })
        if (this['unIndex']) await this.promisify('unIndex')
        return this.save()
      } catch (e) {
        return Promise.reject(e)
      }
    }

    this.methods.restore = async function restore (): Promise<mongoose.Document> {
      try {
        this.set({ deleted_at: null })
        if (this['index']) await this.promisify('index')
        return this.save()
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }

  protected registerCommonPres (): void {
    this.pre('save', function (next) {
      this['wasNew'] = this.isNew
      next()
    })
  }

  protected registerPlugins (): void {
    this.plugin(autopopulate)
  }
}
