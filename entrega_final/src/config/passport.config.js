import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { PRIVATE_KEY } from '../utils/jwt.js'

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
    secretOrKey: PRIVATE_KEY
  }, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload)
    } catch (error) {
      return done(error, false)
    }
  }))
}
