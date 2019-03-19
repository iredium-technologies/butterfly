import { RouteModelBinding } from '~/src/routes/route_model_binding'
import { JsonResponse } from '~/src/routes/responses/json'

/**
 * Handles controller execution and responds to user (API Express version).
 * @param controller Controller instance.
 * @param method Controller instance method name
 */
export const controllerHandler = (controller, method): Function => async (req, res, next): Promise<void> => {
  try {
    const params = req.params
    const routeModelBinding = new RouteModelBinding(params, method)
    const paramRecords = await routeModelBinding.getRouteRecords()
    const boundParams = [req].concat(paramRecords)
    controller.setUser(req.user)
    const response = await controller[method](...boundParams)
    if (response) {
      if (response instanceof JsonResponse) {
        res.status(response.statusCode).json(await response.render())
      } else {
        res.status(200).send(response)
      }
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
}
