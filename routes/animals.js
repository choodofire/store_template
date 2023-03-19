import {Router} from 'express'
import Animal from '../models/animal.js'
import authMiddleware from '../middleware/auth.js'
import User from "../models/user.js";
import checkAPIs from "express-validator"
import validators from "../utils/validators.js";
import Order from "../models/order.js";

const router = Router()
const animalValidators = validators.animalValidators
const {validationResult} = checkAPIs

function isOwner(animal, req) {
    return animal.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const animals = await Animal.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('animals', {
            title: 'Животные',
            isShop: true,
            isAllProducts: true,
            userId: req.user ? req.user._id.toString() : null,
            animals,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id).lean()
        res.status(200).render('animal', {
            // layout: 'empty',
            title: animal.title,
            animal,
        })

    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/:id/edit', authMiddleware, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const animal = await Animal.findById(req.params.id).lean()

        if (!isOwner(animal, req) && !req.user.isAdmin) {
            return res.redirect('/shop')
        }
        res.status(200).render('animal-edit', {
            title: `Редактировать ${animal.title}`,
            animal,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e);
    }
})



router.post('/edit', authMiddleware, animalValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/shop/${req.body.id}/edit?allow=true`)
    }
    try {
        const {id} = req.body
        delete req.body.id
        const animal = await Animal.findById(id)
        if (!isOwner(animal, req) && !req.user.isAdmin) {
            return res.redirect('/shop')
        }
        Object.assign(animal, req.body)
        await animal.save()
        res.redirect('/shop')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.post('/remove', authMiddleware, async (req, res) => {
    try {
        if (req.user.isAdmin) {
            await Animal.deleteOne({
                _id: req.body.id,
            })
        }
        res.redirect('/shop')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

export default router