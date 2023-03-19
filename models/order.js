import {Schema, model} from 'mongoose'

const orderSchema = new Schema({
    animals: [
        {
            animal: {
                type: Object,
                required: true,
            },
            count: {
                type: Number,
                required: true,
            }
        }
    ],
    user: {
        name: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export default model('Order', orderSchema)