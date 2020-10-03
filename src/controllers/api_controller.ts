import { Class } from '~/src/types/class';
import { BaseResponse } from '~/src/routes/responses/base_response'
import { BaseController } from '~/src/controllers/base_controller'
import { NotFoundError } from '../errors';
import { ResourceResponse } from '../routes/responses/resource';
import { BaseSerializer } from '../serializers/base_serializer';
import { ResourceCreatedResponse } from '../routes/responses/resource_created';
import { NoContentResponse } from '../routes/responses/no_content';

export class ApiController extends BaseController {
  public constructor (ServiceClass: Class, PolicyClass: Class) {
    super(ServiceClass, PolicyClass)
  }

  /**
   * Get a collection of Models.
   * @returns A Promise, an exception or a value.
   */
  public async index (req): Promise<BaseResponse> {
    this.authorize('index')
    const defaultIndexQuery = this.getDefaultIndexQuery()
    const searchKeyword = req.query.search?.keyword
    const pagination = await this.service.paginate({
      offset: req.query.offset,
      limit: req.query.limit,
      query: Object.assign(req.query, { deleted_at: null }, defaultIndexQuery),
      searchKeyword
    })
    const serializer = new BaseSerializer({
      model: pagination.getData(),
      pagination: pagination.getMeta()
    })
    return new ResourceResponse(serializer)
  }

  /**
   * Get a Model by id.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async show (req, record): Promise<BaseResponse> {
    if (!record) throw new NotFoundError()
    this.authorize('show', record)
    const serializer = new BaseSerializer({
      model: record,
    })
    return new ResourceResponse(serializer)
  }

  /**
   * Create a Model.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async create (req): Promise<BaseResponse> {
    this.authorize('create')
    req.body.user_id = this.user ? this.user.id : null
    const record = await this.service.create(req.body)
    return new ResourceCreatedResponse(record.id)
  }

  /**
   * Update a Model.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async update (req, record): Promise<BaseResponse> {
    this.authorize('update', record)
    await this.service.update(record, req.body)
    return new NoContentResponse()
  }

  /**
   * Delete a Model.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async destroy (req, record): Promise<BaseResponse> {
    this.authorize('destroy', record)
    await this.service.delete(record)
    return new NoContentResponse()
  }

  /**
   * Restore a deleted Model.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async restore (req, record): Promise<BaseResponse> {
    this.authorize('restore', record)
    await this.service.restore(record)
    return new NoContentResponse()
  }

  protected getDefaultIndexQuery (): object {
    return {}
  }
}
