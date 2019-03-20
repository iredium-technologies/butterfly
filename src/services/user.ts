import { User as Model } from '~/src/models/user'
import { BaseService } from '~/src/services/base_service'
import { UserInterface } from '~/src/models/user/interface'
import mongoose = require('mongoose')

export class UserService extends BaseService {
  public Model: mongoose.Model<UserInterface>

  public constructor () {
    super(Model)
  }
}
