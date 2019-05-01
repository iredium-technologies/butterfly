import { BaseController } from './../controllers/base_controller';
import { RouteModelBinding } from '~/src/routes/route_model_binding'
import { JsonResponse, ViewResponse } from '~/src/routes'
import { RedirectResponse } from '~/src/routes/responses/redirect'

/**
 * Handles controller execution and responds to user (API Express version).
 * @param controller Controller instance.
 * @param method Controller instance method name
 */
export const controllerHandler = (ControllerClass, method): Function => async (req, res, next): Promise<void> => {
  try {
    const controller: BaseController = new ControllerClass()
    if (!controller[method]) throw Error(`Controller's action "${method}" not found`)
    controller.init(req.user)
    const params = req.params
    const routeModelBinding = new RouteModelBinding(params, method)
    const paramRecords = await routeModelBinding.getRouteRecords()
    const boundParams = [req].concat(paramRecords)
    const controllerResponse = await controller[method](...boundParams)
    if (controllerResponse) {
      if (controllerResponse.constructor.name === JsonResponse.name) {
        res.status(controllerResponse.statusCode).json(await controllerResponse.render())
      } else if (controllerResponse.constructor.name === ViewResponse.name) {
        res.status(controllerResponse.statusCode).render(...await controllerResponse.render())
      } else if (controllerResponse.constructor.name === RedirectResponse.name) {
        res.redirect(controllerResponse.statusCode, ...await controllerResponse.render())
      } else {
        res.status(200).send(controllerResponse)
      }
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
}
