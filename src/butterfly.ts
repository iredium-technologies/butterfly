import { BaseError } from './errors/base_error';
import { BaseListener } from '~/src/listeners'
import { Event } from '~/src/events/event'
import { BaseMiddleware } from '~/src/middlewares/base_middleware'
import { ConfigInterface, EventListener } from '~/src/types/config'
import { NotFoundError } from './errors'
import Routes, { RouteDrawer } from '~/src/routes/route_drawer'
import { MongoDb } from './databases/mongodb'
import { ParseAuthUserMiddleware, RequestId } from '~/src/middlewares'
import express = require('express')
import logger = require('morgan')
import bodyParser = require('body-parser')
import dotenv = require('dotenv')
import path = require('path')
import { Database } from './databases/database'
import { Redis } from './databases/redis'

const DEFAULT_VIEW_ENGINE = 'pug'

export default class Butterfly {
  public app: express.Express
  public server
  protected booted: boolean = false
  protected routes: Function
  protected routeDrawer: RouteDrawer
  protected databaseConfigs
  protected databases: Database[] = []
  protected userServiceClass
  protected useViewEngine: boolean
  protected viewEngine: string | undefined
  protected viewsPaths: (string | undefined)[]
  protected modules: Function[]
  protected eventListenerMap: EventListener[]
  protected hooks = {
    'butterfly:setup': [],
    'butterfly:ready': [],
    'butterfly:registerEventListener': [],
    'butterfly:registerViewPaths': [],
    'butterfly:registerMiddlewares': [],
    'butterfly:drawRoutes': [],
    'butterfly:onError': []
  }

  public constructor (config: ConfigInterface) {
    const { routes,
      databases,
      userServiceClass,
      useViewEngine = false,
      viewEngine = DEFAULT_VIEW_ENGINE,
      viewsPaths,
      eventListenerMap } = config
    dotenv.config({
      path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
    })
    this.app = express()
    this.routes = routes
    this.routeDrawer = Routes
    this.userServiceClass = userServiceClass
    this.useViewEngine = useViewEngine
    this.viewsPaths = viewsPaths || [path.join(process.cwd(), '/views')]
    this.viewEngine = viewEngine
    this.modules = config.modules || []
    this.eventListenerMap = eventListenerMap || []
    this.databaseConfigs = databases() || {
      mongo: {
        enable: false,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        database: process.env.MONGO_DATABASE,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD
      }
    }
  }

  public async boot (): Promise<void> {
    if (this.booted) return
    const { PORT = 8080 } = process.env
    await this.bootModules()
    await this.registerEventListener()
    await this.setup()
    await this.connectDatabases()
    await this.registerMiddlewares()
    await this.drawRoutes()
    await this.registerErrorMiddleware()
    this.server = this.app.listen(PORT, async (): Promise<void> => {
      await this.executeHookHandlers('butterfly:ready', {
        server: this.server,
        port: PORT,
      })
    })
    this.booted = true
  }

  public async bootModules (): Promise<void> {
    for (let moduleImport of this.modules) {
      const modules = await moduleImport()
      const moduleNames = Object.keys(modules)

      for (let moduleName of moduleNames) {
        const module = modules[moduleName]
        if (module && typeof module === 'function') {
          module({
            hook: (name, handler): void => {
              this.hook(name, handler)
            }
          })
        }
      }
    }
  }

  public hook (name: string, handler: Function): void {
    if (this.hooks[name]) {
      this.hooks[name].push(handler)
    }
  }

  public close (): Promise<void> {
    return new Promise((resolve): void => {
      this.server.close(async (): Promise<void> => {
        for (let database of this.databases) {
          await database.close()
        }
        resolve()
      })
    })
  }

  protected async executeHookHandlers (name, ...args): Promise<void> {
    const handlers = this.hooks[name]
    if (!handlers) throw new BaseError('Execute Handler Failed', `there is no hook named "${name}"`)
    for (let handler of handlers) {
      await handler(...args)
    }
  }

  protected async registerEventListener (): Promise<void> {
    const moduleEventListenerMap = []
    await this.executeHookHandlers('butterfly:registerEventListener', moduleEventListenerMap)
    for (let eventListener of [...moduleEventListenerMap, ...this.eventListenerMap]) {
      const eventClassModule = await eventListener.event()
      const eventClass = eventClassModule[Object.keys(eventClassModule)[0]]
      for (let listenerModuleImport of eventListener.listeners) {
        const listenerClassModule = await listenerModuleImport()
        const listenerClassName = Object.keys(listenerClassModule)[0]
        const listenerClass = listenerClassModule[listenerClassName]
        const event: Event = new eventClass()
        const listener: BaseListener = new listenerClass()
        Event.on(event.name, ($event): void => {
          listener.handle($event)
        })
      }
    }
  }

  protected async setup (): Promise<void> {
    const app = this.app
    app.disable('x-powered-by')
    app.use(logger('dev', {
      skip: (): boolean => app.get('env') === 'test'
    }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    if (this.useViewEngine) {
      await this.executeHookHandlers('butterfly:registerViewPaths', this.viewsPaths)
      app.set('view engine', this.viewEngine)
      app.set('views', this.viewsPaths)
    }
    await this.executeHookHandlers('butterfly:setup', app)
  }

  protected async connectDatabases (): Promise<void> {
    if (this.databaseConfigs.mongo.enable) {
      const mongoDb = new MongoDb(this.databaseConfigs.mongo)
      this.databases.push(mongoDb)
    }

    if (this.databaseConfigs.redis.enable) {
      const config = this.databaseConfigs.redis
      if (config.password === null) delete config.password
      const redis = new Redis(config)
      this.databases.push(redis)
    }
  }

  protected async registerMiddlewares (): Promise<void> {
    const app = this.app

    const middlewares: BaseMiddleware[] = [
      new RequestId(),
      new ParseAuthUserMiddleware()
    ]

    await this.executeHookHandlers('butterfly:registerMiddlewares', middlewares)

    for (let middleware of middlewares) {
      middleware.setUserServiceClass(this.userServiceClass)
      app.use(middleware.handleMiddelware({ databases: this.databases }))
    }
  }

  protected async registerErrorMiddleware (): Promise<void> {
    const app = this.app
    // Catch 404 and forward to error handler
    app.use((req, res, next): void => {
      const err = new NotFoundError()
      res.status(404)
      next(err)
    })

    // Error handler
    app.use(async (error, req, res, next): Promise<void> => {
      await this.executeHookHandlers('butterfly:onError', error)
      if (Object.keys(error || {}).length) {
        const errorResponse = {
          name: error.name,
          message: error.message,
          code: error.code,
          payload: error.payload
        }
        if (process.env.NODE_ENV !== 'production') {
          errorResponse['stack'] = error.stack
        }
        res.json(errorResponse)
      } else {
        res.status(500)
        res.json({error: process.env.NODE_ENV !== 'production' && error.stack ? error.stack : 'something went wrong'})
      }
    })
  }

  protected async drawRoutes (): Promise<void> {
    this.routeDrawer.draw(this.app, this.routes)
    await this.executeHookHandlers('butterfly:drawRoutes', Routes, this.app)
  }
}
