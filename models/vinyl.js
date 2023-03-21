import {Schema, model} from 'mongoose'

const vinylSchema = new Schema({
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
    format: {
        // Формат записи (LP, Limited Edition, Red; CD, 2000 examples)
        type: String,
        required: false,
    },
    label: {
        // Лейбл
        type: String,
        required: false,
    },
    style: {
        // Жанр альбома
        type: String,
        required: false,
    },
    musician: {
        // Автор пластинки
        type: String,
        required: false,
    },
    release_date: {
        // Дата релиза
        type: String,
        required: false,
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

vinylSchema.method('toClient', function () {
    const vinyl = this.toObject()
    vinyl.id = vinyl._id
    delete vinyl._id
    return vinyl
})

export default model('Vinyl', vinylSchema)