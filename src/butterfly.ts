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
  protected routes: Function
  protected databases

  public constructor ({ routes = function (route): void {}, databases = null } = {}) {
    dotenv.config({
      path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
    })
    this.app = express()
    this.routes = routes
    this.databases = databases ? databases() : {
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
    this.app.listen(PORT, (): void => console.log(`Iredium core listening on port ${PORT}`)) // eslint-disable-line no-console
  }

  protected setup (): void {
    const app = this.app
    app.disable('x-powered-by')
    app.use(logger('dev', {
      skip: (): boolean => app.get('env') === 'test'
    }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
  }

  protected connectDatabases (): void {
    if (this.databases.mongo.enable) mongodb(this.databases.mongo)
  }

  protected registerMiddlewares (): void {
    const app = this.app
    app.use(RequestId.default())
    app.use(ParseAuthUserMiddleware.default())
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
          errorResponse = BaseError.toJSON(error)
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
  }

  protected drawRoutes (): void {
    Routes.draw(this.app, this.routes)
  }
}
