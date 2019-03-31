import { Task as Model } from '~/example/models/task'
import { BaseService } from '~/src/services/base_service'
import { UserInterface } from '~/example/models/task/interface'
import mongoose = require('mongoose')

export class TaskService extends BaseService {
  public Model: mongoose.Model<UserInterface> = Model

  public constructor () {
    super(Model)
  }
}
