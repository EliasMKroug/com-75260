import MongoDao from './mongo.dao.js'
import { usersModel } from '../models/users.models.js'

class UserDao extends MongoDao {
  getByEmail = async (email) => {
    try {
      return await this.model.findOne({ email })
    } catch (error) {
      throw new Error(error)
    }
  }

  getUserById = async (id) => {
    try {
      return await this.model.findById(id).populate('cart')
    } catch (error) {
      throw new Error(error)
    }
  }
}

export const userDao = new UserDao(usersModel)
