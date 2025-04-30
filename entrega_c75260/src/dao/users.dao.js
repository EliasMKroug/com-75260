import { usersModel } from '../dao/models/users.models.js'

class usersMongo {
    constructor(){
        this.model = usersModel
    }
    
    getUser = async filter => await this.model.findOne(filter)
    createUser = async newUser => await this.model.create(newUser)
}

export default usersMongo