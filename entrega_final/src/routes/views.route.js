import { Router } from 'express'

const router = Router()

// Enpoint productos con query params
router.get('/', async (req, res) => {
  res.redirect('/login')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

export default router
