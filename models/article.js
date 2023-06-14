import {Schema, model} from 'mongoose'

const articleSchema = new Schema({
    title: {
        // Название
        type: String,
        required: true,
    },
    price: {
        // Цена
        type: Number,
        required: true,
    },
    img: {
        // Ссылка на фото
        type: String,
        required: true,
    },
    quantity: {
        // Количество
        type: Number,
        required: true,
        default: 1,
    },
    description: {
        // Доп описание
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