const error404 = function (req, res, next) {
    res.status(404).render('404', {
        title: 'Page not found',
    })
}

export default error404