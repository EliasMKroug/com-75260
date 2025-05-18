import { connect } from 'mongoose'
import 'dotenv/config'

export const connectToMongo = async () => {
  try {
    await connect(process.env.MONGO_URI || process.env.MONGO_LOCAL_UR)
  } catch (e) {
    throw new Error(e)
  }
}
