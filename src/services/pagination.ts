export class Pagination {
  protected Model
  protected query
  protected offset: number
  protected limit: number
  protected sort
  protected populates
  protected options

  public constructor ({ Model, offset = 0, limit = 20, sort = { created_at: -1 }, populates = [], query = {}, options = {} }) {
    this.Model = Model
    this.query = query
    this.offset = offset
    this.limit = limit
    this.sort = sort
    this.populates = populates
    this.options = options
  }

  public getData (): object {
    const query = this.cleanQuery(this.query)
    const result = this.Model.find(query)
      .sort(this.sort)
      .skip(this.offset)
      .limit(this.limit)
    for (let index in this.populates) {
      result.populate(this.populates[index])
    }
    return result.exec()
  }

  public async getMeta (): Promise<object> {
    const total = await this.Model.countDocuments(this.cleanQuery(this.query)).exec()
    return Promise.resolve({
      offset: this.offset,
      limit: this.limit,
      total: total
    })
  }

  protected cleanQuery (query): object {
    const filteredQuery = Object.assign({ deleted_at: null }, query)
    for (let key in filteredQuery) {
      if (filteredQuery[key] === '') delete filteredQuery[key]
      if (filteredQuery[key] === 'null') filteredQuery[key] = null
    }
    if (this.options.withDeleted) delete filteredQuery.deleted_at
    delete filteredQuery.offset
    delete filteredQuery.limit
    return filteredQuery
  }
}
