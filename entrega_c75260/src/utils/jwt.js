import jwt from 'jsonwebtoken'

const PRIVATE_KEY = 'coder-secret' // Corregí un typo: "sercret" → "secret"

const generateToken = (user) => jwt.sign(user, PRIVATE_KEY, { expiresIn: '24h' })

export { PRIVATE_KEY, generateToken }
