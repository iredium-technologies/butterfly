import { Class } from '~/src/types/class';
import { BaseService } from '~/src/services/base_service'
import { BasePolicy } from '~/src/policies/base_policy'
import { UnauthorizedError } from '~/src/errors/unauthorized'

export class BaseController {
  protected PolicyClass: Class
  protected ServiceClass: Class
  protected user
  protected service: BaseService

  public constructor (ServiceClass: Class, PolicyClass: Class) {
    this.ServiceClass = ServiceClass
    this.PolicyClass = PolicyClass
    this.service = new ServiceClass()

  }

  public authorize (method, record = null): void {
    const policy = this.PolicyClass ? new this.PolicyClass(this.user, record) : new BasePolicy(this.user, record)
    if (!policy[method](record)) {
      throw new UnauthorizedError()
    }
  }

  public init (user): void {
    this.user = user
    this.service = new this.ServiceClass(user)
  }
}
