import {Router} from 'express'
import authMiddleware from "../middleware/auth.js";
import checkAPIs from "express-validator"
import validators from "../utils/validators.js";
import Article from "../models/article.js";
import { handleImageUpload } from "../middleware/file.js";
import path from "path";

const router = Router()

const {validationResult} = checkAPIs
const articleValidators = validators.articleValidators

router.get('/', authMiddleware, (req, res) => {
    if (req.user.isAdmin) {
        res.status(200).render('add', {
            title: 'Добавить предмет',
            isAdd: true,
        })
    } else {
        res.redirect('/')
    }
})

router.post('/', authMiddleware, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Добавить предмет',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                ...req.body
            }
        })
    }


    if (req.files?.article) {
        req.body.img = path.join("images", "articles", req.files.article[0].filename);
    }

    const newArticle = Object.assign({...req.body}, {userId: req.user._id})
    const article = new Article(Object.assign(newArticle))

    try {
        await article.save()
        res.redirect('/shop')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }

})

export default router