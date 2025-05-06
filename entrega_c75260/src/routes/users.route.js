import { Router } from 'express'
import usersMongo from '../dao/users.dao.js'

const router = Router()
const usersManager = new usersMongo()

// Endpoint para obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await usersManager.getUsers(req.query)
    res.status(200).json({ message: 'Usuarios encontrados', payload: users })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', payload: error })
  }
})

// Endpoint para registrar un nuevo usuario
router.post('/', async (req, res) => {
  const userCreated = await usersManager.createUsers(req.body)
  res.status(201).json({ message: 'Usuario creado', payload: userCreated })
})

export default router
