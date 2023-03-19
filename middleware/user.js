import User from '../models/user.js'

const userMiddleware = async function(req, res, next) {
    if (!req.session.user) {
        return next()
    }
    req.user = await User.findById(req.session.user._id)
    next()
}

export default userMiddleware