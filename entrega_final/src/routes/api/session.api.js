import { passportCall } from '../../midlewere/passportCall.middleware.js'
import { userController } from '../../controllers/user.controller.js'
import { authorization } from '../../midlewere/authorization.middleware.js'
import { Router } from 'express'

const router = Router()

router.post('/register', userController.register)

router.post('/login', userController.login)

router.get('/current', passportCall('jwt'), authorization(['admin', 'user']), userController.current)

export default router
