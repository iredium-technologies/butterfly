import { titleCase } from '~/src/helpers/title_case'
import { NotFoundError } from '~/src/errors/not_found'
import mongoose = require('mongoose')

export class RouteModelBinding {
  protected params
  protected method

  public constructor (params, method) {
    this.params = params
    this.method = method
  }

  public async getRouteRecords (): Promise<object> {
    const records = []
    for (let param in this.params) {
      const model = this.getModel(param)
      const routeKeyName = model.getRouteKeyName() || '_id'
      const query = {}
      if (!['restore', 'destroy'].includes(this.method)) {
        query['deleted_at'] = null
      }
      query[routeKeyName] = this.params[param]
      const record = await model.findOne(query).exec()
      if (!record) throw new NotFoundError()
      records.push(record)
    }
    return Promise.resolve(records)
  }

  public getModel (param): mongoose.Model {
    const name = `${titleCase(param.replace(/_/g, ' ')).replace(/ /g, '')}`
    return mongoose.models[name]
  }
}
