import { userDao } from '../dao/mongodb/users.dao.js'
import { cartDaoMongo } from '../dao/mongodb/carts.dao.js'
import CustomError from '../utils/custom-error.js'
import UserDTO from '../dto/user.dto.js'
import { createHash, isValidPassword } from '../utils/bcrypt.js'
import jwt from 'jsonwebtoken'

class UserService {
  constructor (dao) {
    this.dao = dao
  }

  register = async (user) => {
    const { email, password } = user
    const existUser = await this.dao.getByEmail(email)
    if (existUser) throw new CustomError('El usuario ya existe', 404)
    const cartUser = await cartDaoMongo.create()
    if (
      email === process.env.EMAIL_ADMIN &&
        password === process.env.PASS_ADMIN
    ) {
      return await this.dao.create({
        ...user,
        password: createHash(password),
        role: 'admin',
        cart: cartUser._id
      })
    } else {
      return await this.dao.create({
        ...user,
        password: createHash(password),
        cart: cartUser._id
      })
    }
  }

  login = async (email, password) => {
    const userExist = await this.dao.getByEmail(email)
    if (!userExist) throw new CustomError('Credenciales incorrectas', 401)
    const passValid = isValidPassword(password, userExist.password)
    if (!passValid) throw new CustomError('Credenciales incorrectas', 401)
    return userExist
  }

  getById = async (id) => {
    return await this.dao.getById(id)
  }

  getUserById = async (id) => {
    try {
      const user = await this.dao.getUserById(id)
      return new UserDTO(user)
    } catch (error) {
      throw new Error(error)
    }
  }

  generateToken = (user) => {
    const payload = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '24h'
    })
  }
}

export const userService = new UserService(userDao)
