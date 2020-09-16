import autopopulate = require('mongoose-autopopulate')
import mongoose = require('mongoose')
import { UUID, registerType, getter as convertToUUIDString } from './_types/uuid'
import { UUID as UUIDHelper } from '~/src/helpers/uuid';

registerType(mongoose)

function convertUUIDToString (root): void {
  let keys: number[] | string[] = Object.keys(root)

  if (root.constructor.name === 'Array') {
    keys = keys.map((k): number => Number(k))
  }

  for (let key of keys) {
    const type = root[key] ? root[key].constructor.name : null
    const isArray = type === 'Array'
    const isObject = type === 'object' || type === 'Object'

    if (type === 'Binary') {
      try {
        root[key] = convertToUUIDString(root[key])
      } catch (e) {
        //
      }
    } else if (isArray || isObject) {
      convertUUIDToString(root[key])
    }
  }
}

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
        virtuals: true,
      },
      toJSON: {
        virtuals: true,
        transform: function (doc, ret, options): object {
          convertUUIDToString(ret)
          ret.id = convertToUUIDString(ret.uuid)
          delete ret._id
          delete ret.uuid
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
        uuid: { type: UUID, default: UUIDHelper.v4Base62, protect: true, unique: true, dropDups: true },
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
    this.registerCommonVirtuals()
    this.registerPlugins()
  }

  protected registerCommonVirtuals (): void {
    this.virtual('id')
      .get(function (): string {
        // @ts-ignore
        return this.uuid
      }).set(function (id): void {
        // @ts-ignore
        this.set({ uuid: id })
      })
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
      return new Promise((resolve, reject): void => {
        this[method]((error, res): void => {
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
    this.pre('save', function (next): void {
      this['wasNew'] = this.isNew
      next()
    })
  }

  protected registerPlugins (): void {
    this.plugin(autopopulate)
  }
}
