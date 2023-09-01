import {Router} from 'express'
import authMiddleware from '../middleware/auth.js'
import Article from "../models/article.js";

const router = Router()

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.articleId._doc,
        id: c.articleId.id,
        count: c.count,
    }))
}

function computePrice(articles) {
    return articles.reduce((total, article) => {
        return total += article.price * article.count
    }, 0)
}

router.post('/add', authMiddleware, async (req, res) => {
    const article = await Article.findById(req.body.id)
    await req.user.addToCart(article)
    res.status(200).redirect('/shop')
})

router.get('/', authMiddleware, async (req, res) => {
    const user = await req.user.populate('cart.items.articleId')

    const articles = mapCartItems(user.cart)

    res.render('cart', {
        title: 'Cart',
        isCart: true,
        articles: articles,
        price: computePrice(articles),
    })
})

router.delete('/remove/:id', authMiddleware, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.articles')

    const articles = mapCartItems(user.cart)
    const cart = {
        articles, price: computePrice(articles)
    }

    res.status(200).json(cart)
})

export default router