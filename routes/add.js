import {Router} from 'express'
import authMiddleware from "../middleware/auth.js";
import checkAPIs from "express-validator"
import validators from "../utils/validators.js";
import Vinyl from "../models/vinyl.js";

const router = Router()

const {validationResult} = checkAPIs
const vinylValidators = validators.vinylValidators

router.get('/', authMiddleware, (req, res) => {
    if (req.user.isAdmin) {
        res.status(200).render('add', {
            title: 'Добавить виниловую пластинку',
            isAdd: true,
        })
    } else {
        res.redirect('/')
    }
})

router.post('/', authMiddleware, vinylValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Добавить виниловую пластинку',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img,
                description: req.body.description,
            }
        })
    }

    const vinyl = new Vinyl({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        description: req.body.description,
        userId: req.user._id,
    })

    try {
        await vinyl.save()
        res.redirect('/shop')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }

})

export default router