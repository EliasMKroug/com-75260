import { productDaoMongo } from '../dao/mongodb/product.dao.js'
import CustomError from '../utils/custom-error.js'

class ProductService {
  constructor (dao) {
    this.dao = dao
  }

  getAll = async () => {
    try {
      return await this.dao.getAll()
    } catch (error) {
      throw new Error(error)
    }
  }

  getById = async (id) => {
    const response = await this.dao.getById(id)
    if (!response) throw new CustomError('Producto no encontrado', 404)
    return response
  }

  create = async (body) => {
    const response = await this.dao.create(body)
    if (!response) throw new CustomError('Error al crear el producto', 404)
    return response
  }

  update = async (id, body) => {
    const response = await this.dao.update(id, body)
    if (!response) { throw new CustomError('Error al actualizar el producto', 404) }
    return response
  }

  delete = async (id) => {
    const response = await this.dao.delete(id)
    if (!response) { throw new CustomError('Error al eliminar el producto', 404) }
    return response
  }
}

export const productService = new ProductService(productDaoMongo)
