import {Router} from 'express'
import Order from '../models/order.js'
import authMiddleware from '../middleware/auth.js'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({'user.userId': req.user._id})
            .lean()
            .populate('user.userId')
        res.render('orders', {
            title: 'Заказы',
            isOrders: true,
            orders: orders.map(o => {
                return {
                    ...o,
                    price: o.vinyls.reduce((total, c) => {
                        return total += c.count * c.vinyl.price
                    }, 0)
                }
            })
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.vinylId')
        const vinyls = user.cart.items.map(i => ({
            count: i.count,
            vinyl: {...i.vinylId}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            vinyls: vinyls,
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