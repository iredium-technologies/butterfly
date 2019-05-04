import { User as Model, UserType } from '~/src/models/user'
import { BaseService } from '~/src/services/base_service'

export class UserService extends BaseService {
  public Model: UserType = Model

  public constructor () {
    super(Model)
  }
}
