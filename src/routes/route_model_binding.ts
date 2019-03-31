import { titleCase } from '~/src/helpers/title_case'
import { NotFoundError } from '~/src/errors/not_found'
import { BaseModelInterface } from '~/src/models/base_model_interface'
import mongoose = require('mongoose')

export class RouteModelBinding {
  protected Model: mongoose.Model<BaseModelInterface>
  protected params
  protected method

  public constructor (params, method) {
    this.Model = mongoose.Model
    this.params = params
    this.method = method
  }

  public async getRouteRecords (): Promise<object> {
    const records: BaseModelInterface[] = []
    for (let param in this.params) {
      const modelName = this.getModelName(param)
      const Model: mongoose.Model<BaseModelInterface> = mongoose.models[modelName]
      const routeKeyName = Model['getRouteKeyName']() || '_id'
      const query = {}
      if (!['restore', 'destroy'].includes(this.method)) {
        query['deleted_at'] = null
      }
      query[routeKeyName] = this.params[param]
      const record = await Model.findOne(query).exec() as BaseModelInterface
      if (!record) throw new NotFoundError()
      records.push(record)
    }
    return Promise.resolve(records)
  }

  public getModelName (param): string {
    return `${titleCase(param.replace(/_/g, ' ')).replace(/ /g, '')}`
  }
}
