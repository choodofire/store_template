import {Router} from 'express'
import authMiddleware from '../middleware/auth.js'
import User from "../models/user.js";
import Order from "../models/order.js";
import { handleImageUpload } from "../middleware/file.js";
import path from "path";

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
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
                price: o.vinyls.reduce((total, c) => {
                    return total += c.count * c.vinyl.price
                }, 0)
            }
        })
    })
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        const toChange = {
            name: req.body.name,
            address: {
                country: req.body?.country,
                fullAddress: req.body?.fullAddress,
            }
        }

        if (req.files?.avatar) {
            toChange.avatarUrl = path.join("images", "avatars", req.files.avatar[0].filename);
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