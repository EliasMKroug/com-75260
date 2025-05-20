import { productsModel } from '../models/products.models.js'
import MongoDao from './mongo.dao.js'

class ProductDaoMongo extends MongoDao {
}

export const productDaoMongo = new ProductDaoMongo(productsModel)
