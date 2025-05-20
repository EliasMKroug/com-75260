import { Router } from 'express'
import productRouter from '../routes/products.route.js'
import cartRouter from '../routes/carts.route.js'
import viewsRouter from '../routes/views.route.js'

export default class MainRouter {
  constructor () {
    this.router = Router()
    this.init()
  }

  init () {
    this.router.use('/products', productRouter)
    this.router.use('/carts', cartRouter)
    this.router.use('/', viewsRouter)
  }

  getRouter () {
    return this.router
  }
}

export const productsRouter = new MainRouter()
