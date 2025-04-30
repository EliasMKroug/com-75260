import { Router } from 'express';
import usersMongo from '../dao/users.dao.js';

const router = Router();
const usersManager = new usersMongo();

// Endpoint para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await usersManager.getUser({});
        res.status(200).json({ message: 'Usuarios encontrados', payload: users });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', payload: error });
    }
});

// Endpoint para registrar un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password,
            role
        };
        const userCreated = await usersManager.createUser(newUser);
        res.status(201).json({ message: 'Usuario creado', payload: userCreated });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', payload: error });
    }
});

export default router;

