export const authorization = (roles) => {
  return (req, res, next) => {
    if (roles[0].toUpperCase() === 'PUBLIC') return next()
    if (!req.user) return res.status(401).send({ status: 'error', error: 'Unauthorized' })

    const userRole = req.user.role.toUpperCase()
    const allowedRoles = roles.map(role => role.toUpperCase())

    if (allowedRoles.includes(userRole)) return next()

    return res.status(403).send({ status: 'error', error: 'Forbidden' })
  }
}
