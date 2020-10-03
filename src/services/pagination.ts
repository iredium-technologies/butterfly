import { BaseModelInterface } from '~/src/models/base_model_interface';
export class Pagination {
  protected Model
  protected query
  protected filteredQuery
  protected offset: number
  protected limit: number
  protected sort
  protected populates
  protected options
  protected searchKeyword
  protected data: BaseModelInterface | null
  protected meta
  protected totalPage: number
  protected currentPage: number

  public constructor ({ Model, searchKeyword, offset = 0, limit = 20, sort = { created_at: -1 }, populates = [], query = {}, filteredQuery = {}, options = {} }) {
    this.Model = Model
    this.offset = offset
    this.limit = limit
    this.sort = sort
    this.populates = populates
    this.options = options
    this.searchKeyword = searchKeyword
    this.query = this.cleanQuery(query)
    this.filteredQuery = this.cleanQuery(filteredQuery)
    this.data = null
    this.meta = null
    this.totalPage = 0
    this.currentPage = 0
  }

  public async run (): Promise<Pagination> {
    const query = this.filteredQuery
    if (this.searchKeyword) {
      const $text = {
        $search: this.searchKeyword
      }
      query.$text = $text
    }
    const result = this.Model.find(query)
      .sort(this.sort)
      .skip(this.offset)
      .limit(this.limit)

    for (let index in this.populates) {
      result.populate(this.populates[index])
    }

    this.data = await result.exec()

    const total = await this.Model.countDocuments(query).exec()

    this.meta = {
      offset: this.offset,
      limit: this.limit,
      total: total
    }

    this.totalPage = Math.ceil(this.meta.total / this.limit)
    this.currentPage = Math.ceil((this.offset / this.limit) + 1)

    return this
  }

  public getData (): BaseModelInterface | null {
    return this.data
  }

  public getMeta (): object {
    return this.meta
  }

  public links (): object {
    const pages: object[] = []
    const currentPage = this.currentPage
    const previousPage = this.currentPage - 1
    const nextPage = this.currentPage + 1
    if (this.totalPage <= 7) {
      for (let page = 1; page <= this.totalPage; page++) {
        pages.push(this.createPageInfo(page))
      }
    } else {
      const linkCount = 7
      const min = 2
      const max = linkCount - 1
      const medianPadding = 1
      if (currentPage - medianPadding > min && currentPage + medianPadding < this.totalPage - 1) {
        pages.push(this.createPageInfo(1))
        pages.push(this.createPageInfo(null))
        for (let page = currentPage - medianPadding; page <= currentPage + medianPadding; page++) {
          pages.push(this.createPageInfo(page))
        }
        pages.push(this.createPageInfo(null))
        pages.push(this.createPageInfo(this.totalPage))
      } else if (currentPage - medianPadding <= min) {
        for (let page = 1; page < max; page++) {
          pages.push(this.createPageInfo(page))
        }
        pages.push(this.createPageInfo(null))
        pages.push(this.createPageInfo(this.totalPage))
      } else if (currentPage + medianPadding >= max) {
        for (let page = this.totalPage; page > this.totalPage - (linkCount - 2); page--) {
          pages.unshift(this.createPageInfo(page))
        }
        pages.unshift(this.createPageInfo(null))
        pages.unshift(this.createPageInfo(1))
      }
    }
    return {
      current: this.createPageInfo(currentPage),
      prev: this.createPageInfo(previousPage),
      next: this.createPageInfo(nextPage),
      pages
    }
  }

  protected createPageInfo (page): object {
    if (!page || page < 1 || page > this.totalPage) return {
      page: null
    }
    return {
      page,
      current: page.toString() === this.currentPage.toString(),
      queryString: this.buildQueryString(page)
    }
  }

  protected buildQueryString (page): string {
    const offset = (page - 1) * this.limit
    let queryString = ''
    const query = {
      ...this.getMeta(),
      ...this.query,
      offset
    }
    delete query.deleted_at
    delete query.total
    for (let key in query) {
      if (!queryString) queryString = '?'
      queryString += `${key}=${query[key]}&`
    }
    if (queryString[queryString.length - 1] === '&')
      queryString = queryString.substring(0, queryString.length - 1);
    return queryString
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
