import { Task as Model, TaskType } from '~/example/models/task'
import { BaseService } from '~/src/services/base_service'

export class TaskService extends BaseService {
  public Model: TaskType = Model
}
