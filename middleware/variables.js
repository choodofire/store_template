const varMiddleware = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    if (res.locals.isAuth) {
        res.locals.isAdmin = req.session.user.isAdmin
    } else {
        res.locals.isAdmin = false
    }
    next()
}

export default varMiddleware