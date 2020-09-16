import { titleCase } from '~/src/helpers/title_case'
import { NotFoundError } from '~/src/errors/not_found'
import { BaseModelInterface } from '~/src/models/base_model_interface'
import mongoose = require('mongoose')
import { base62 } from '../helpers/encoding'

export class RouteModelBinding {
  protected Model: mongoose.Model<BaseModelInterface>
  protected params
  protected method

  public constructor (params, method) {
    this.Model = mongoose.Model
    this.params = params
    this.method = method
  }

  public async getRouteRecords (): Promise<BaseModelInterface[]> {
    const records: BaseModelInterface[] = []
    for (let param in this.params) {
      const modelName = this.getModelName(param)
      let Model: mongoose.Model<BaseModelInterface> = mongoose.models[modelName]
      if (!Model) {
        Model = mongoose.models[`_${modelName}`]
      }
      if (Model) {
        const routeKeyName = Model['getRouteKeyName']() || 'uuid'
        const query = {}
        const routeKeyParamValue = this.params[param]
        query[routeKeyName] = routeKeyParamValue
        if (!['restore', 'destroy'].includes(this.method)) {
          query['deleted_at'] = null
        }
        try {
          const record = await Model.findOne(query).exec() as BaseModelInterface
          if (!record) throw new NotFoundError()
          records.push(record)
        } catch (e) {
          if (e.message && (
            e.message.includes('Non-base62 character') ||
            e.message.includes('Exceeded maximum length of 22')
          )) {
            console.error({error: e.stack})
            throw new NotFoundError()
          }
          throw e
        }
      }
    }
    return Promise.resolve(records)
  }

  public getModelName (param): string {
    return `${titleCase(param.replace(/_/g, ' ')).replace(/ /g, '')}`
  }
}
