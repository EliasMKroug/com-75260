import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { userService } from '../../services/user.service.js'
import 'dotenv/config'

// Extrae el token desde req.cookies.token
const cookieExtractor = (req) => {
  return req?.cookies?.token || null
}

export const initializePassport = () => {
  passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      cookieExtractor
    ]),
    secretOrKey: process.env.SECRET_KEY
  }, async (jwtPayload, done) => {
    try {
      return done(null, jwtPayload)
    } catch (error) {
      return done(error, false)
    }
  }))
}

/* ------------------------------------ extraer token desde headers ----------------------------------- */
// export const initializePassport = () => {
//   passport.use('jwt', new JwtStrategy({
//     jwtFromRequest: ExtractJwt.fromExtractors([
//       ExtractJwt.fromAuthHeaderAsBearerToken(),
//       cookieExtractor
//     ]),
//     secretOrKey: PRIVATE_KEY
//   }, async (jwt_payload, done) => {
//     try {
//       return done(null, jwt_payload)
//     } catch (error) {
//       return done(error, false)
//     }
//   }))
// }

// const strategyConfig = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.PRIVATE_KEY
// }

// const verifyToken = async (jwtPayload, done) => {
//   if (!jwtPayload) return done(null, false, { messages: 'Invalid Token' })
//   return done(null, jwtPayload)
// }

// passport.use('jwt', new Strategy(strategyConfig, verifyToken))

/* ------------------------------------ extraer token desde cookies ----------------------------------- */

// const cookieExtractor = (req) => {
//   return req.cookies.token
// }

// const strategyConfigCookies = {
//   jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
//   secretOrKey: process.env.JWT_SECRET
// }

// passport.use('jwt-cookies', new Strategy(strategyConfigCookies, verifyToken))

/* ------------------------------------ serialize y deserialize va siempre ----------------------------------- */

passport.serializeUser((user, done) => {
  try {
    // console.log(user)
    done(null, user._id)
  } catch (error) {
    done(error)
  }
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getById(id)
    return done(null, user)
  } catch (error) {
    done(error)
  }
})
