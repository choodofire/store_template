import {Router} from 'express'
import Order from '../models/order.js'
import authMiddleware from '../middleware/auth.js'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const orders = await Order.find()
                .lean()
                .populate('user.userId')
            res.render('orders', {
                title: 'All orders',
                isOrders: true,
                orders: orders.map(o => {
                    return {
                        ...o,
                        price: o.articles.reduce((total, c) => {
                            return total += c.count * c.article.price
                        }, 0)
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }
    } else {
        res.redirect('/')
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.articleId')

        const articles = user.cart.items.map(i => ({
            count: i.count,
            article: {...i.articleId}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            articles: articles,
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

export default router