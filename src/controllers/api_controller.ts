import { Class } from '~/src/types/class';
import { BaseResponse } from '~/src/routes/responses/base_response'
import { BaseController } from '~/src/controllers/base_controller'
import { JsonResponse } from '~/src/routes/responses/json'
import { NotFoundError } from '../errors';

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
    const pagination = await this.service.paginate({
      offset: req.query.offset,
      limit: req.query.limit,
      query: Object.assign(req.query, { deleted_at: null })
    })
    return new JsonResponse(pagination.getData(), pagination.getMeta())
  }

  /**
   * Get a Model by id.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async show (req, record): Promise<BaseResponse> {
    if (!record) throw new NotFoundError()
    this.authorize('show', record)
    return new JsonResponse(await this.service.get(record._id))
  }

  /**
   * Create a Model.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async create (req): Promise<BaseResponse> {
    this.authorize('create')
    req.body.user = this.user ? this.user._id : null
    const record = await this.service.create(req.body)
    return new JsonResponse(record)
  }

  /**
   * Update a Model.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async update (req, record): Promise<BaseResponse> {
    this.authorize('update', record)
    const result = await this.service.update(record, req.body)
    return new JsonResponse(result)
  }

  /**
   * Delete a Model.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async destroy (req, record): Promise<BaseResponse> {
    this.authorize('destroy', record)
    const result = await this.service.delete(record)
    return new JsonResponse(result)
  }

  /**
   * Restore a deleted Model.
   * @param req an express's request object.
   * @returns A Promise, an exception or a value.
   */
  public async restore (req, record): Promise<BaseResponse> {
    this.authorize('restore', record)
    const result = await this.service.restore(record)
    return new JsonResponse(result)
  }
}
