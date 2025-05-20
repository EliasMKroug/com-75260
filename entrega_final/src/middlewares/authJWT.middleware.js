import jwt from 'jsonwebtoken'
import 'dotenv/config'

const SECRET_KEY = process.env.SECRET_KEY

export const generateToken = (user) => {
  const payload = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email
  }

  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '15m'
  })
}

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.get('Authorization')
    if (!token) return res.status(401).json({ msg: 'Unauthorized' })
    const tokenClean = token.split(' ')[1]
    const decode = jwt.verify(tokenClean, SECRET_KEY)
    console.log(decode)
    req.user = decode
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Unauthorized' })
  }
}
