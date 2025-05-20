import { Router } from 'express'
import productRouter from './products.routes.api.js'
import cartRouter from './carts.api.routes.js'
import userRouter from './user.api.routes.js'
import sessionRouter from './session.api.js'

export default class MainRouter {
  constructor () {
    this.router = Router()
    this.init()
  }

  init () {
    this.router.use('/products', productRouter)
    this.router.use('/users', userRouter)
    this.router.use('/carts', cartRouter)
    this.router.use('/sessions', sessionRouter)
  }

  getRouter () {
    return this.router
  }
}

export const apiRouter = new MainRouter()
