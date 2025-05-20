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
import { initializePassport } from './config/passport/jwt-strategy.js'
import { apiRouter } from './routes/api/index.js'
import { productsRouter } from './routes/index.js'
import { errorHandler } from './middlewares/error.middlewere.js'

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

// Middleware para manejo de cookies
initializePassport()

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

app
// Middleware para lectura de JSON y archivos estáticos
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static(__dirname + '/public'))
  .use(cookieParser())
  .use(passport.initialize())
  .use(session(sessionConfig))
  .use(passport.session())
// Middleware para errores de servidor
  .use(errorHandler)
// Rutas FS
  .use('/', productsRouter.getRouter())
// Rutas de Socket.IO
  .use('/realtimeproducts', realTimeProducts)
// Rutas de la API
  .use('/api', apiRouter.getRouter())

// Conexión a Socket.IO
setupSocket(socketServer)

// Conexión a MongoDB
connectToMongo()
  .then(() => console.log('Se conecto a la base de datos'))
  .catch((error) => console.log(error))

// Server escuchando en el puerto 8080
httpServer.listen(PORT, (error) => {
  if (error) {
    console.log(error)
  }
  console.log(`Escuchando en http://localhost:${PORT}`)
})
