import {Router} from "express";

const router = Router()

router.get('/', async(req, res) => {
    res.status(200).render('info', {
        title: 'Информация',
        isInfo: true,
    })
})

export default router