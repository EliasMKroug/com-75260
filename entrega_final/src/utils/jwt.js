import jwt from 'jsonwebtoken'
import 'dotenv/config'

const { SECRET_KEY } = process.env

const generateToken = (user) => jwt.sign(user, SECRET_KEY, { expiresIn: '24h' })

export { SECRET_KEY, generateToken }
