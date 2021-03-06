import { Router } from 'express'
import { controllerHandler as handle } from '~/src/routes/controller_handler'
import { isClass } from '~/src/helpers/is_class'
import pluralize = require('pluralize')
import { RequestHandlerParams } from 'express-serve-static-core';

export class RouteDrawer {
  protected router: Router

  public constructor () {
    this.router = Router()
  }

  public draw (router, c): void {
    this.router = router
    if (c) c(this)
  }

  public getActions (param): object {
    return {
      index: {
        path: '/',
        method: 'get'
      },
      show: {
        path: `/:${param}`,
        method: 'get'
      },
      create: {
        path: '/',
        method: 'post'
      },
      update: {
        path: `/:${param}`,
        method: 'patch'
      },
      destroy: {
        path: `/:${param}`,
        method: 'delete'
      },
      restore: {
        path: `/:${param}/restore`,
        method: 'patch'
      }
    }
  }

  public resources (...args): void {
    if (args.length < 2) throw Error(`Expect minimal 2 arguments, got ${args.length}`)
    const router = Router()
    const hasCallback = args.length > 2 && !isClass(args[args.length - 1])
    const basePath = args[0]
    const c = hasCallback ? args[args.length - 1] : null
    const ControllerClass = hasCallback ? args[args.length - 2] : args[args.length - 1]
    const middlewares = hasCallback ? args.splice(1, args.length - 3).map((o): void => o.get ? o.get() : o) : args.splice(1, args.length - 2).map((o): void => o.get ? o.get() : o)
    const path = basePath.split('/')
    const param = pluralize.singular(path[path.length - 1])
    const actions = this.getActions(param)

    console.log({path: args[0], middlewares, ControllerClass})

    for (let key in actions) {
      const m = ([] as void[]).concat(middlewares)
      const action = actions[key]
      m.push(handle(ControllerClass, key) as unknown as void)
      router[action.method](action.path, ...m)
    }

    this.router.use(basePath, router)
    const route = new RouteDrawer()

    if (c) route.draw(router, c)
  }

  public group (...args): void {
    const router = Router()
    const basePath = args[0]
    const c = args[args.length - 1]
    const middlewares = args.splice(1, args.length - 2).map((o): void => o.get ? o.get() : o)

    this.router.use(basePath, ...middlewares as unknown as RequestHandlerParams[])
    const route = new RouteDrawer()

    if (c) route.draw(router, c)
  }

  public use (...args): void {
    return this.handleMethod('use', args)
  }

  public options (...args): void {
    return this.handleMethod('options', args)
  }

  public get (...args): void {
    return this.handleMethod('get', args)
  }

  public post (...args): void {
    return this.handleMethod('post', args)
  }

  public patch (...args): void {
    return this.handleMethod('patch', args)
  }

  public put (...args): void {
    return this.handleMethod('put', args)
  }

  public delete (...args): void {
    return this.handleMethod('delete', args)
  }

  public handleMethod (method, args): void {
    const path = args[0]
    const middlewares = args.filter((o): boolean => o).splice(1, args.length - 1).map((o): void => o.get ? o.get() : o)
    return this.router[method](path, ...middlewares)
  }
}

export default new RouteDrawer()
