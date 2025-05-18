import express from 'express'
import path from 'path'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Server as ServerIO } from 'socket.io'
import { Server as ServerHttp } from 'http'
import { __dirname } from './utils.js'
import { engine } from 'express-handlebars'

//  Rutas de Socket.IO
import realTimeProducts, { setupSocket } from './routes/realTimeProducts.route.js'

// Rutas
import { connectToMongo } from './connections/db.conections.js'
import viewsRouter from './routes/views.route.js'
import productsRouter from './routes/products.route.js'
import cartsRouter from './routes/carts.route.js'
import producsApiRoutes from './routes/api/products.routes.api.js'
import cartApiRoutes from './routes/api/carts.api.routes.js'
import usersRouter from './routes/user.route.js'
import sessionApiRouters from './routes/api/session.api.js'
import { initializePassport } from './config/passport/jwt-strategy.js'

// Variables globales
const app = express()
const PORT = process.env.PORT || 8080
const httpServer = new ServerHttp(app)
const socketServer = new ServerIO(httpServer)

// Configuración de Handlebars con el helper JSON
app.engine('handlebars', engine({
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    json: function (context) {
      return JSON.stringify(context, null, 2)
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}))

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || process.env.MONGO_LOCAL_URI,
    ttl: 180
  }),
  secret: '1234',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 180000
  }
}

// Middleware para lectura de JSON y archivos estáticos
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())

// Middleware para manejo de cookies
initializePassport()
app.use(passport.initialize())

app.use(session(sessionConfig))
app.use(passport.session())

// Conexión a Socket.IO
setupSocket(socketServer)

// Conexión a MongoDB
connectToMongo()
  .then(() => console.log('Se conecto a la base de datos'))
  .catch((error) => console.log(error))

// Rutas FS
app.use('/', viewsRouter)
app.use('/products', productsRouter)
app.use('/carts', cartsRouter)
app.use('/users', usersRouter)

// Rutas de Socket.IO
app.use('/realtimeproducts', realTimeProducts)

// Rutas de la API
app.use('/api/products', producsApiRoutes)
app.use('/api/carts', cartApiRoutes)
app.use('/api/sessions', sessionApiRouters)

// Middleware para errores de servidor
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).send('Error 500 en el servidor')
})

// Server escuchando en el puerto 8080
httpServer.listen(PORT, (error) => {
  if (error) {
    console.log(error)
  }
  console.log(`Escuchando en http://localhost:${PORT}`)
})
