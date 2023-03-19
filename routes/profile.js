import {Router} from 'express'
import auth from '../middleware/auth.js'
import User from "../models/user.js";
import Order from "../models/order.js";

const router = Router()

router.get('/', auth, async (req, res) => {
    const orders = await Order.find({'user.userId': req.user._id})
        .lean()
        .populate('user.userId')

    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject(),
        orders: orders.map(o => {
            return {
                ...o,
                price: o.animals.reduce((total, c) => {
                    return total += c.count * c.animal.price
                }, 0)
            }
        })
    })
})

router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        const toChange = {
            name: req.body.name,
            address: {
                country: req.body?.country,
                fullAddress: req.body?.fullAddress,
            }
        }

        if (req.file) {
            toChange.avatarUrl = req.file.path
        }

        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})


export default router