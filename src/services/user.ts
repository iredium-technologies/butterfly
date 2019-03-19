import { User as Model } from '~/src/models/user'
import { BaseService } from '~/src/services/base_service'

export class UserService extends BaseService {
  public constructor () {
    super(Model)
  }
}
