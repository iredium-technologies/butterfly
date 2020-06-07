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
import cookieParserGenerator = require('cookie-parser')

const DEFAULT_VIEW_ENGINE = 'pug'

class App {
  public app: express.Express
  public server
  protected booted: boolean = false
  protected routes: Function
  protected routeDrawer: RouteDrawer
  protected databaseConfigs
  protected databases: Database[] = []
  protected userServiceClass
  protected useViewEngine: boolean
  protected useDefaultLogger: boolean
  protected viewEngine: string | undefined
  protected viewsPaths: (string | undefined)[]
  protected errorView: string | undefined
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
      useDefaultLogger = true,
      useViewEngine = false,
      viewEngine = DEFAULT_VIEW_ENGINE,
      viewsPaths,
      errorView,
      eventListenerMap } = config
    dotenv.config({
      path: path.resolve(process.cwd(), config.env['NODE_ENV'] === 'test' ? '.env.test' : '.env')
    })
    this.app = express()
    this.routes = routes
    this.routeDrawer = Routes
    this.userServiceClass = userServiceClass
    this.useViewEngine = useViewEngine
    this.viewsPaths = viewsPaths || [path.join(process.cwd(), '/views')]
    this.errorView = errorView
    this.viewEngine = viewEngine
    this.modules = config.modules || []
    this.useDefaultLogger = useDefaultLogger
    this.eventListenerMap = eventListenerMap || []
    this.databaseConfigs = databases() || {
      mongo: {
        enable: false,
        host: config.env['MONGO_HOST'],
        port: config.env['MONGO_PORT'],
        database: config.env['MONGO_DATABASE'],
        username: config.env['MONGO_USERNAME'],
        password: config.env['MONGO_PASSWORD']
      }
    }
    this.app.locals.config = config
  }

  public async boot (): Promise<void> {
    if (this.booted) return
    const { PORT = 8080 } = this.app.locals.config.env
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
    app.use((req, _res, next): void => {
      const start = process.hrtime()
      req['locals'] = {
        startTime: start,
        timingMark: {}
      }
      next()
    })
    app.disable('x-powered-by')
    if (this.useDefaultLogger) {
      app.use(logger('dev', {
        skip: (): boolean => app.get('env') === 'test'
      }))
    }
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParserGenerator())
    if (this.useViewEngine) {
      await this.executeHookHandlers('butterfly:registerViewPaths', this.viewsPaths)
      app.set('view engine', this.viewEngine)
      app.set('views', this.viewsPaths)
    }
    await this.executeHookHandlers('butterfly:setup', app)
  }

  protected async connectDatabases (): Promise<void> {
    if (this.databaseConfigs.mongo.enable) {
      const mongoDb = new MongoDb(this.databaseConfigs.mongo, this.app.locals.config.env['NODE_ENV'] !== 'production' && this.app.locals.config.env['NODE_ENV'] !== 'test')
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

    const moduleMiddlewares: BaseMiddleware[] = []

    await this.executeHookHandlers('butterfly:registerMiddlewares', moduleMiddlewares)

    const middlewares = [
      new RequestId(),
      new ParseAuthUserMiddleware(),
      ...moduleMiddlewares,
    ]

    for (let middleware of middlewares) {
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
      const isNotProduction = req.app.locals.config.env['NODE_ENV'] !== 'production'
      let response = {
        status: 500,
        body: {}
      }

      if (error.config) {
        response.body = {
          config: {
            method: error.config.method,
            timeout: error.config.timeout,
            baseURL: error.config.baseURL,
            url: error.config.url,
            headers: {
              ...(error.config.headers ? error.config.headers : {}),
              ...(error.config.headers && error.config.headers.Authorization ? {
                Authorization: `${error.config.headers.Authorization.substr(0, 10)}***`
              } : {})
            },
            data: error.config.data,
          },
          request: error.request ? {
            method: error.request.method,
            status: error.request.status,
            statusText: error.request.statusText,
            withCredentials: error.request.withCredentials,
            readyState: error.request.readyState,
            responseURL: error.request.responseURL,
            timeout: error.request.timeout,
            responseType: error.request.responseType,
          } : null,
          response: error.response ? {
            status: error.response.status,
            headers: error.response.headers,
            data: error.response.data
          } : null,
        }
      } else if (error.payload) {
        response.body = {
          name: error.name,
          code: error.code,
          payload: error.payload
        }
        if (error.payload.status >= 100 && error.payload.status < 600) {
          response.status = error.payload.status
        }
      }

      if (isNotProduction) {
        response.body['stack'] = error.stack
      }

      response.body['message'] = error.message
      response.body['url'] = req.originalUrl
      response.body['request_id'] = req['locals'].requestId
      response.body['user'] = req['locals'].user ? {
        id: req['locals'].user.id || req['locals'].user._id,
        username: req['locals'].user.username
      } : null

      await this.executeHookHandlers('butterfly:onError', { response, error, req })

      res.status(response.status)

      if (this.errorView) {
        res.render(this.errorView, { error, req })
      } else {
        res.json(response.body)
      }
    })
  }

  protected async drawRoutes (): Promise<void> {
    this.routeDrawer.draw(this.app, this.routes)
    await this.executeHookHandlers('butterfly:drawRoutes', Routes, this.app)
  }
}

export default App

export const Butterfly = App
