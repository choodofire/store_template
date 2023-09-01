import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.status(200).render('index', {
        title: 'Home page',
        isHome: true,
        isMain: true,
    })
})

export default router