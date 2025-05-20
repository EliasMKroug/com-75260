import { Schema, model } from 'mongoose'

const cartsCollection = 'carts'

const cartsSchema = new Schema({
  products: [
    {
      _id: false,
      quantity: {
        type: Number,
        default: 1
      },
      product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
      }
    }
  ]
})

// ODM
export const cartsModel = model(cartsCollection, cartsSchema)
