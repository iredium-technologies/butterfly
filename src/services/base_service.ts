import { BaseModelInterface } from '~/src/models/base_model_interface'
import validateID from '~/src/helpers/validate_id'
import { Pagination } from '~/src/services/pagination'
import mongoose = require('mongoose')

export class BaseService {
  public Model: mongoose.Model<BaseModelInterface>
  public populates
  public sort
  public populateUser

  public constructor (Model, populates = null, sort = { created_at: -1 }) {
    this.Model = Model
    this.populates = populates
    this.sort = sort
    this.populateUser = { path: 'user', select: 'id username first_name last_name default_address' }
  }

  public paginate ({ options = {}, query = {}, offset = 0, limit = 20 } = {}): Promise<Pagination> {
    return Promise.resolve(new Pagination({
      Model: this.Model,
      offset,
      limit,
      sort: this.sort,
      populates: this.populates,
      query,
      options
    }))
  }

  /**
   * Get a Model by id.
   * @param query mongoo query object.
   * @param where mongoo query with the following format.
   *  where = {
   *    name: {
   *      equals: ''
   *    }
   *  }
   * @returns A Promise, an exception or a value.
   *
   */
  public find ({ query = {}, where = {}, offset = '0', limit = '20', sort = '-created_at' } = {}): Promise<BaseModelInterface[]> {
    const result = this.Model.find(query)
    for (let key in where) {
      for (let operator in where[key]) {
        result.where(key)[operator](where[key][operator])
      }
    }
    result.skip(parseInt(offset, 10))
    result.limit(parseInt(limit, 10))
    result.sort(sort)
    for (let index in this.populates) {
      result.populate(this.populates[index])
    }
    return result.exec()
  }

  public get (index, field = '_id', options = {}): Promise<BaseModelInterface> {
    if (!field) field = '_id'
    if (field === '_id' && typeof index === 'string' && !validateID(index)) return Promise.resolve(null)
    const query = {}
    if (!options['withDeleted']) query['deleted_at'] = null
    query[field] = index
    const result = this.Model.findOne(query)
    for (let index in this.populates) {
      result.populate(this.populates[index])
    }
    return result.exec()
  }

  public create (data): Promise<BaseModelInterface> {
    const record = new this.Model(data)
    return record.save()
  }

  public async update (record, data): Promise<BaseModelInterface> {
    record.massAssign(data)
    await record.save()
    return this.get(record._id) // to re-evaluate virtuals
  }

  public async delete (record, user): Promise<BaseModelInterface> {
    if (!record.deleted_at) {
      return Promise.resolve(await record.softDelete(user))
    }
    return Promise.resolve(record)
  }

  public async restore (record): Promise<BaseModelInterface> {
    if (record.deleted_at) {
      return Promise.resolve(await record.restore())
    }
    return Promise.resolve(record)
  }
}
