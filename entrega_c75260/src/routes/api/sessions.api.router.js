import { Router } from 'express'
import usersMongo from '../../dao/users.dao.js'
import { createHash, isValidPassword } from '../../utils/bcrypt.js'
import { generateToken } from '../../utils/jwt.js'
import { passportCall } from '../../midlewere/passportCall.middleware.js'
import { authorization } from '../../midlewere/authorization.middleware.js'

const router = Router()
const usersManager = new usersMongo()

// Endpoint para el registro de un nuevo usuario
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' })
  }

  const usersFound = await usersManager.getUser({ email })

  if (usersFound) {
    return res.status(400).json({ message: 'El usuario ya existe' })
  }

  const newUser = {
    first_name,
    last_name,
    email,
    password: createHash(password),
    role: 'admin'
  }

  const userCreated = usersManager.createUsers(newUser)

  const token = generateToken({
    email,
    id: userCreated._id
  })

  res
    .cookie('token', token, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true
    })
    .send({ status: 'success', message: 'Usuario creado' })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).send({ status: 'error', message: 'Debe ingresar todas las credenciales' })
  }
  const usersFound = await usersManager.getUser({ email })

  if (!isValidPassword({ password: usersFound.password }, password)) {
    return res.status(401).send({ status: 'error', message: 'Credenciales incorrectas' })
  }

  const token = generateToken({
    email,
    id: usersFound._id,
    role: usersFound.role
  })

  res
    .cookie('token', token, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true
    })
    .send({ status: 'success', message: 'Usuario logueado', token: token })
})

router.get('/current', passportCall('jwt'), authorization(['admin', 'user']), async(req, res) => {
  res.send('datos sensibles')
})

export default router
