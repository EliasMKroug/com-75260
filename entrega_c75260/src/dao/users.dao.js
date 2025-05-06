import { usersModel } from '../dao/models/users.models.js'

class usersMongo {
  constructor () {
    this.model = usersModel
  }

  getUser = async filter => await this.model.findOne(filter)

  getUsers = async (queryUser) => {
    const { limit = 10, page = 1, sort = '', ...query } = queryUser
    const sortManager = {
      asc: 1,
      desc: -1
    }

    const users = await this.model.paginate(
      { ...query },
      {
        limit,
        page,
        ...(sort && { sort: { age: sortManager[sort] } }),
        customLabels: { docs: 'payload' }
      }
    )
    return users
  }

  createUser = async newUser => await this.model.create(newUser)

  createUsers = async (user) => {
    try {
      const userCreated = await this.model.create(user)
      return userCreated
    } catch (error) {
      console.error('Error al crear el usuario:', error)
      throw error
    }
  }
}

export default usersMongo
