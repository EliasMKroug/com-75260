import { Schema, model } from 'mongoose'
import mongoosepaginatev2 from 'mongoose-paginate-v2'

const usersCollection = 'users'

const usersSchema = new Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  age: Number,
  password: String,
  cart: {
    type: Schema.ObjectId,
    ref: 'carts',
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'user_premium', 'admin'],
    default: 'user'
  }
})

usersSchema.plugin(mongoosepaginatev2)

export const usersModel = model(usersCollection, usersSchema)
