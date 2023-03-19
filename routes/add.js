import {Router} from 'express'
import Animal from '../models/animal.js'
import authMiddleware from "../middleware/auth.js";
import checkAPIs from "express-validator"
import validators from "../utils/validators.js";

const router = Router()

const {validationResult} = checkAPIs
const animalValidators = validators.animalValidators

router.get('/', authMiddleware, (req, res) => {
    if (req.user.isAdmin) {
        res.status(200).render('add', {
            title: 'Добавить животное',
            isAdd: true,
        })
    } else {
        res.redirect('/')
    }
})

router.post('/', authMiddleware, animalValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Добавить животное',
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
    const animal = new Animal({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        description: req.body.description,
        userId: req.user._id,
    })

    try {
        await animal.save()
        res.redirect('/shop')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }

})

export default router