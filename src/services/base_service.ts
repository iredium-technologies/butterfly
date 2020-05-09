import { BaseModelInterface } from '~/src/models/base_model_interface'
import validateID from '~/src/helpers/validate_id'
import { Pagination } from '~/src/services/pagination'
import mongoose = require('mongoose')
import { NotFoundError } from '../errors';

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 20

export class BaseService {
  public Model: mongoose.Model<BaseModelInterface>
  public populates
  public sort
  public populateUser
  public keys: string[]
  protected user

  public constructor (Model, user = null, populates = null, sort = { created_at: -1 }) {
    this.Model = Model
    this.populates = populates
    this.sort = sort
    this.user = user
    this.populateUser = { path: 'user', select: 'id username first_name last_name default_address' }
    this.keys = Object.keys(Model['schema']['tree'])
  }

  public async paginate ({ options = {}, query = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = {}): Promise<Pagination> {
    const pagination = new Pagination({
      Model: this.Model,
      offset: this.parseInt(offset, DEFAULT_OFFSET),
      limit: this.parseInt(limit, DEFAULT_LIMIT),
      sort: this.sort,
      populates: this.populates,
      query: query,
      filteredQuery: this.filterQuery(query),
      options
    })

    return pagination.run()
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
  public find ({ query = {}, where = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT, sort = '-created_at' } = {}): Promise<BaseModelInterface[]> {
    const result = this.Model.find(this.filterQuery(query))
    for (let key in where) {
      for (let operator in where[key]) {
        result.where(key)[operator](where[key][operator])
      }
    }
    result.skip(this.parseInt(offset, DEFAULT_OFFSET))
    result.limit(this.parseInt(limit, DEFAULT_LIMIT))
    result.sort(sort)
    for (let index in this.populates) {
      result.populate(this.populates[index])
    }
    return result.exec()
  }

  public async get (index, field = '_id', options = {}): Promise<BaseModelInterface> {
    if (!field) field = '_id'
    if (field === '_id' && typeof index === 'string' && !validateID(index)) return Promise.reject(new Error('invalid id'))
    const query = {}
    if (!options['withDeleted']) query['deleted_at'] = null
    query[field] = index
    const result = this.Model.findOne(query)
    for (let index in this.populates) {
      result.populate(this.populates[index])
    }
    const resultPromise = await result.exec()
    if (resultPromise) {
      return Promise.resolve(resultPromise)
    }
    return Promise.reject(new NotFoundError())
  }

  public create (data): Promise<BaseModelInterface> {
    const record = new this.Model(data)
    return record.save()
  }

  public async update (record, data): Promise<BaseModelInterface> {
    await record.massAssign(data)
    return this.get(record._id) as Promise<BaseModelInterface> // to re-evaluate virtuals
  }

  public async delete (record): Promise<BaseModelInterface> {
    if (!record.deleted_at) {
      return Promise.resolve(await record.softDelete(this.user))
    }
    return Promise.resolve(record)
  }

  public async restore (record): Promise<BaseModelInterface> {
    if (record.deleted_at) {
      return Promise.resolve(await record.restore())
    }
    return Promise.resolve(record)
  }

  protected parseInt(str: string | number, fallback: number): number {
    const number = parseInt(str as unknown as string, 10)
    if (isNaN(number)) return fallback
    return number
  }

  protected filterQuery (query): object {
    const validKeys = this.keys
    const filterQuery = {}
    for (let key in query) {
      if (validKeys.includes(key)) {
        filterQuery[key] = query[key]
      }
    }
    return filterQuery
  }
}
