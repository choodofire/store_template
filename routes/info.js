import {Router} from "express";

const router = Router()

router.get('/', async(req, res) => {
    res.status(200).render('info', {
        title: 'Info',
        isInfo: true,
    })
})

export default router