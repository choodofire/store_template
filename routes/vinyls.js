import {Router} from 'express'
import authMiddleware from '../middleware/auth.js'
import User from "../models/user.js";
import checkAPIs from "express-validator"
import validators from "../utils/validators.js";
import Order from "../models/order.js";
import Vinyl from "../models/vinyl.js";

const router = Router()
const vinylValidators = validators.vinylValidators
const {validationResult} = checkAPIs

function isOwner(record, req) {
    return record.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const vinyls = await Vinyl.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('vinyls', {
            title: 'Пластинки',
            isShop: true,
            isAllProducts: true,
            userId: req.user ? req.user._id.toString() : null,
            vinyls,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const vinyl = await Vinyl.findById(req.params.id).lean()
        res.status(200).render('vinyl', {
            // layout: 'empty',
            title: vinyl.title,
            vinyl,
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
        const vinyl = await Vinyl.findById(req.params.id).lean()

        if (!isOwner(vinyl, req) && !req.user.isAdmin) {
            return res.redirect('/shop')
        }
        res.status(200).render('vinyl-edit', {
            title: `Редактировать ${vinyl.title}`,
            vinyl,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e);
    }
})

router.post('/edit', authMiddleware, vinylValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/shop/${req.body.id}/edit?allow=true`)
    }
    try {
        const {id} = req.body
        delete req.body.id
        const vinyl = await Vinyl.findById(id)
        if (!isOwner(vinyl, req) && !req.user.isAdmin) {
            return res.redirect('/shop')
        }
        Object.assign(vinyl, req.body)
        await vinyl.save()
        res.redirect('/shop')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.post('/remove', authMiddleware, async (req, res) => {
    try {
        if (req.user.isAdmin) {
            await Vinyl.deleteOne({
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