import autopopulate = require('mongoose-autopopulate')
import mongoose = require('mongoose')
import { v4 as uuidv4 } from 'uuid'
import { UUID } from 'mongoose-uuid2'

mongoose.Types['UUID'] = mongoose.SchemaTypes['UUID'] = UUID;

export class BaseSchema extends mongoose.Schema {
  public statics
  public methods
  public wasNew: boolean
  protected defaultRouteKeyName
  protected fillable
  protected populateUser

  public constructor (schema) {
    const baseOptions = {
      id: false,
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
        uuid: { type: UUID, default: uuidv4, protect: true },
        deleted_at: { type: Date, default: null, protect: true },
        deleted_by: { type: String, default: null, hidden: true, protect: true }
      }
    }
    super(combinedSchema, baseOptions)
    this.wasNew = false
    this.populateUser = { select: 'id username first_name last_name default_address email' }
    this.defaultRouteKeyName = 'uuid'
    this.fillable = Object.keys(schema).filter((key): boolean =>
      key != '_id' &&
      key != '__v' &&
      key != 'uuid' &&
      key != 'created_at' &&
      key != 'updated_at' &&
      key != 'deleted_at' &&
      !schema[key].guarded
    );
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

    this.methods.massAssign = async function massAssign (data): Promise<mongoose.Document> {
      try {
        const allowedData = {}
        Object.keys(data).forEach((key): void => {
          if (this.fillable.includes(key)) {
            allowedData[key] = data[key]
          }
        })
        this.set(allowedData)
        return this.save()
      } catch (e) {
        return Promise.reject(e)
      }
    }

    this.methods.softDelete = async function softDelete (user): Promise<mongoose.Document> {
      try {
        this.set({ deleted_at: Date.now(), deleted_by: user ? user.uuid : null })
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
