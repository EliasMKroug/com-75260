import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { PRIVATE_KEY } from '../utils/jwt.js'

// ✅ Cookie extractor: extrae el token desde req.cookies.token
const cookieExtractor = (req) => {
  return req?.cookies?.token || null
}

export const initializePassport = () => {
  passport.use('jwt', new JwtStrategy({
    // ✅ Permite usar header Authorization o cookie 'token'
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(), // "Authorization: Bearer <token>"
      cookieExtractor                             // "token" cookie
    ]),
    secretOrKey: PRIVATE_KEY
  }, async (jwt_payload, done) => {
    try {
      // Si querés, podrías buscar el usuario en DB aquí usando jwt_payload.id
      return done(null, jwt_payload)
    } catch (error) {
      return done(error, false)
    }
  }))
}
