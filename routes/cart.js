import {Router} from 'express'
import authMiddleware from '../middleware/auth.js'
import Vinyl from "../models/vinyl.js";

const router = Router()

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.vinylId._doc,
        id: c.vinylId.id,
        count: c.count,
    }))
}

function computePrice(vinyls) {
    return vinyls.reduce((total, vinyl) => {
        return total += vinyl.price * vinyl.count
    }, 0)
}

router.post('/add', authMiddleware, async (req, res) => {
    const vinyl = await Vinyl.findById(req.body.id)
    await req.user.addToCart(vinyl)
    res.redirect('/cart')
})

router.get('/', authMiddleware, async (req, res) => {
    const user = await req.user.populate('cart.items.vinylId')

    const vinyls = mapCartItems(user.cart)

    res.render('cart', {
        title: 'Корзина',
        isCart: true,
        vinyls: vinyls,
        price: computePrice(vinyls),
    })
})

router.delete('/remove/:id', authMiddleware, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.vinylId')

    const vinyls = mapCartItems(user.cart)
    const cart = {
        vinyls, price: computePrice(vinyls)
    }

    res.status(200).json(cart)
})

export default router