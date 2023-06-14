import {Router} from 'express'
import authMiddleware from '../middleware/auth.js'
import User from "../models/user.js";
import checkAPIs from "express-validator"
import validators from "../utils/validators.js";
import Order from "../models/order.js";
import Article from "../models/article.js";
import article from "../models/article.js";

const router = Router()
const articleValidators = validators.articleValidators
const {validationResult} = checkAPIs

function isOwner(record, req) {
    return record.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const articles = await Article.find()
            .lean()
            .populate('userId', 'email name')
        res.status(200).render('shop', {
            title: 'Предметы',
            isShop: true,
            isAllProducts: true,
            userId: req.user ? req.user._id.toString() : null,
            articles,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).lean()
        res.status(200).render('article', {
            // layout: 'empty',
            title: article.title,
            article,
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
        const article = await Article.findById(req.params.id).lean()

        if (!isOwner(article, req) && !req.user.isAdmin) {
            return res.redirect('/shop')
        }
        res.status(200).render('article-edit', {
            title: `Редактировать ${article.title}`,
            article,
        })
    } catch (e) {
        res.status(500).send()
        console.log(e);
    }
})

router.post('/edit', authMiddleware, articleValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/shop/${req.body.id}/edit?allow=true`)
    }
    try {
        const {id} = req.body
        delete req.body.id
        const article = await Article.findById(id)
        if (!isOwner(article, req) && !req.user.isAdmin) {
            return res.redirect('/shop')
        }
        Object.assign(article, req.body)
        await article.save()
        res.redirect('/shop')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

router.post('/remove', authMiddleware, async (req, res) => {
    try {
        if (req.user.isAdmin) {
            await Article.deleteOne({
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