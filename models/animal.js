import {Schema, model} from 'mongoose'

const animalSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    description: {
      type: String,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

animalSchema.method('toClient', function () {
    const animal = this.toObject()

    animal.id = animal._id
    delete animal._id

    return animal
})

export default model('Animal', animalSchema)