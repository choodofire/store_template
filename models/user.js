import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    avatarUrl: {
        type: String,
    },
    address: {
        country: {
            type: String,
        },
        fullAddress: {
            type: String,
        },
    },
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                animalId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Animal',
                    required: true,
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function(animal) {
    const clonedItems = [...this.cart.items]
    const idx = clonedItems.findIndex(c => {
        return c.animalId.toString() ===animal._id.toString()
    })

    if (idx >= 0) {
        clonedItems[idx].count++
    } else {
        clonedItems.push({
            animalId: animal._id,
            count: 1,
        })
    }
    this.cart = {items: clonedItems}
    return this.save()
}

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(c => c.animalId.toString() === id.toString())

    if (items[idx].count === 1) {
        items = items.filter(c => c.animalId.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}

export default model('User', userSchema)