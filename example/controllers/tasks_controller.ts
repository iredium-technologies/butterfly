import { TaskService } from '~/example/services/task'
import { ApiController } from '~/src/controllers/api_controller'
import { TaskPolicy } from '~/example/policies/task'

export class TasksController extends ApiController {
  public constructor () {
    super(TaskService, TaskPolicy)
  }
}
