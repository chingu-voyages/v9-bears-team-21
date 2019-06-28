export default (req, res, next) => {
  if (!req.session.loggedIn) return res.status(404).json({err: "User not logged in"})
  next()
}
