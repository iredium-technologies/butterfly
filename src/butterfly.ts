import { ConfigInterface } from '~/src/types/config';
import { BaseError } from '~/src/errors/base_error'
import { NotFoundError } from './errors'
import Routes from '~/src/routes/route_drawer'
import { MongoDb } from './databases/mongodb'
import { ParseAuthUserMiddleware, RequestId } from '~/src/middlewares'
import express = require('express')
import logger = require('morgan')
import bodyParser = require('body-parser')
import dotenv = require('dotenv')
import path = require('path')
import { Database } from './databases/database';

const DEFAULT_VIEW_ENGINE = 'pug'

export default class Butterfly {
  public app: express.Express
  public server
  protected routes: Function
  protected databaseConfigs
  protected databases: Database[] = []
  protected userServiceClass
  protected useViewEngine: boolean
  protected viewEngine: string | undefined
  protected viewsPaths: (string | undefined)[]
  protected hooks = {
    'butterfly:setup': [],
    'butterfly:ready': [],
    'butterfly:registerViewPaths': [],
    'butterfly:registerMiddlewares': [],
    'butterfly:drawRoutes': [],
    'butterfly:registerErrorMiddleware': []
  }

  public constructor (config: ConfigInterface) {
    const { routes, databases, userServiceClass, useViewEngine = false, viewEngine = DEFAULT_VIEW_ENGINE, viewsPaths } = config
    dotenv.config({
      path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
    })
    this.app = express()
    this.routes = routes
    this.userServiceClass = userServiceClass
    this.useViewEngine = useViewEngine
    this.viewsPaths = viewsPaths || [path.join(process.cwd(), '/views')]
    this.viewEngine = viewEngine
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
    const { PORT = 8080 } = process.env
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
    for (let handler of handlers) {
      await handler(...args)
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
      const mongoDb = new MongoDb()
      await mongoDb.connect(this.databaseConfigs.mongo)
      this.databases.push(mongoDb)
    }
  }

  protected async registerMiddlewares (): Promise<void> {
    const app = this.app
    app.use(RequestId.default())
    if (this.userServiceClass) app.use(ParseAuthUserMiddleware.default(this.userServiceClass))
    await this.executeHookHandlers('butterfly:registerMiddlewares', app)
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
    app.use((error, req, res, next): void => {
      let errorResponse = error
      if (error instanceof Error) {
        const code = error['code']
        if (code) {
          res.status(!isNaN(parseInt(code, 10)) && code <= 504 ? code : 400)
          errorResponse = BaseError.toJSON(new BaseError(error.name, error.message))
        } else if (error.name === 'ValidationError' || error.name === 'CastError' || code === 'LIMIT_UNEXPECTED_FILE') {
          res.status(400)
        } else {
          res.status(500)
          errorResponse = {
            message: error.message
          }
        }
      }
      console.log(error)
      res.json(errorResponse)
    })

    await this.executeHookHandlers('butterfly:registerErrorMiddleware', app)
  }

  protected async drawRoutes (): Promise<void> {
    Routes.draw(this.app, this.routes)
    await this.executeHookHandlers('butterfly:drawRoutes', Routes, this.app)
  }
}
