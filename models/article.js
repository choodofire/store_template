import {Schema, model} from 'mongoose'

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        // Link to photo
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    description: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

articleSchema.method('toClient', function () {
    const article = this.toObject()
    article.id = article._id
    delete article._id
    return article
})

export default model('Article', articleSchema)