import {Router} from 'express'
import Animal from "../models/animal.js";
import authMiddleware from '../middleware/auth.js'

const router = Router()

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.animalId._doc,
        id: c.animalId.id,
        count: c.count,
    }))
}

function computePrice(animals) {
    return animals.reduce((total, animal) => {
        return total += animal.price * animal.count
    }, 0)
}

router.post('/add', authMiddleware, async (req, res) => {
    const animal = await Animal.findById(req.body.id)
    await req.user.addToCart(animal)
    res.redirect('/cart')
})

router.get('/', authMiddleware, async (req, res) => {
    const user = await req.user.populate('cart.items.animalId')

    const animals = mapCartItems(user.cart)

    res.render('cart', {
        title: 'Корзина',
        isCart: true,
        animals: animals,
        price: computePrice(animals),
    })
})

router.delete('/remove/:id', authMiddleware, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.animalId')

    const animals = mapCartItems(user.cart)
    const cart = {
        animals, price: computePrice(animals)
    }

    res.status(200).json(cart)
})

export default router