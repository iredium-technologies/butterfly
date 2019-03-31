import { ConfigInterface } from '~/src/types/config';
import { BaseError } from '~/src/errors/base_error'
import { NotFoundError } from './errors'
import Routes from '~/src/routes/route_drawer'
import { mongodb } from './databases/mongodb'
import { ParseAuthUserMiddleware, RequestId } from '~/src/middlewares'
import express = require('express')
import logger = require('morgan')
import bodyParser = require('body-parser')
import dotenv = require('dotenv')
import path = require('path')

export default class Butterfly {
  public app: express.Express
  public server
  protected routes: Function
  protected databases
  protected userServiceClass
  protected hooks = {
    'butterfly:setup': [],
    'butterfly:registerErrorMiddleware': []
  }

  public constructor (config: ConfigInterface) {
    const { routes, databases, userServiceClass } = config
    dotenv.config({
      path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
    })
    this.app = express()
    this.routes = routes
    this.userServiceClass = userServiceClass
    this.databases = databases() || {
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

  public boot (): void {
    const { PORT = 8080 } = process.env
    this.setup()
    this.connectDatabases()
    this.registerMiddlewares()
    this.drawRoutes()
    this.registerErrorMiddleware()
    this.server = this.app.listen(PORT, (): void => console.log(`Iredium core listening on port ${PORT}`)) // eslint-disable-line no-console
  }

  public hook (name: string, handler: Function): void {
    if (this.hooks[name]) {
      this.hooks[name].push(handler)
    }
  }

  public close (): Promise<void> {
    return new Promise((resolve): void => {
      this.server.close((): void => {
        resolve()
      })
    })
  }

  protected executeHookHandlers (name, ...args): void {
    const handlers = this.hooks[name]
    for (let handler of handlers) {
      handler.call(this, args)
    }
  }

  protected setup (): void {
    const app = this.app
    app.disable('x-powered-by')
    app.use(logger('dev', {
      skip: (): boolean => app.get('env') === 'test'
    }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    this.executeHookHandlers('butterfly:setup', app)
  }

  protected connectDatabases (): void {
    if (this.databases.mongo.enable) mongodb(this.databases.mongo)
  }

  protected registerMiddlewares (): void {
    const app = this.app
    app.use(RequestId.default())
    if (this.userServiceClass) app.use(ParseAuthUserMiddleware.default(this.userServiceClass))
  }

  protected registerErrorMiddleware (): void {
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

    this.executeHookHandlers('butterfly:registerErrorMiddleware', app)
  }

  protected drawRoutes (): void {
    Routes.draw(this.app, this.routes)
  }
}
