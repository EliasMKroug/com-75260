import { Schema, model } from 'mongoose'

const usersCollection= 'users'

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
    cartID: {
        type: Schema.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['user', 'user_premium', 'admin'],
        default: 'user'
    }
})

export const usersModel = model(usersCollection, usersSchema)

