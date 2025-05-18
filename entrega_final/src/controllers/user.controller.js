import { userService } from '../services/user.service.js'
import { createResponse } from '../utils/bcrypt.js'

class UserController {
  constructor (service) {
    this.service = service
  }

  register = async (req, res, next) => {
    try {
      const data = await this.service.register(req.body)
      createResponse(res, 201, data)
    } catch (error) {
      next(error)
    }
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await this.service.login(email, password)
      const token = this.service.generateToken(user)
      res.cookie('token', token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true }).json({ user, token })
    } catch (error) {
      next(error)
    }
  }

  current = async (req, res, next) => {
    try {
      const { _id } = req.user
      const user = await this.service.getUserById(_id)
      createResponse(res, 200, user)
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UserController(userService)
