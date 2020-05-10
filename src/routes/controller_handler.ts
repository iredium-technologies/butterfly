import { BaseError } from './../errors/base_error';
import { BaseResponse } from '~/src/routes/responses/base_response'
import { BaseController } from './../controllers/base_controller'
import { RouteModelBinding } from '~/src/routes/route_model_binding'
import express = require('express')

/**
 * Handles controller execution and responds to user (API Express version).
 * @param controller Controller instance.
 * @param method Controller instance method name
 */
export const controllerHandler = (ControllerClass, method): Function => async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const controller: BaseController = new ControllerClass()
    if (!controller[method]) throw Error(`Controller's action "${method}" not found`)
    controller.init(req['locals']['user'])
    const params = req.params
    const routeModelBinding = new RouteModelBinding(params, method)
    const paramRecords = await routeModelBinding.getRouteRecords()
    const boundParams = [
      req,
      ...paramRecords
    ]
    const controllerResponse = await controller[method](...boundParams)
    if (controllerResponse instanceof BaseResponse) {
      controllerResponse.executeRender(res)
    } else {
      throw new BaseError('Server Error', 'Response must be an instance of BaseResponse')
    }
  } catch (error) {
    next(error)
  }
}
