import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'avatar') {
            cb(null, 'images/avatars');
        } else if (file.fieldname === 'vinyl') {
            cb(null, 'images/vinyls');
        } else {
            cb(new Error('Invalid file type'));
        }
    },
    filename: function (req, file, cb) {
        if (file.fieldname === 'avatar') {
            cb(null, req.session.user.email + ".png")
        } else if (file.fieldname === 'vinyl') {
            cb(null, req.body.title + ".png")
        } else {
            cb(new Error('Invalid file type'));
        }
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const fileMiddleware = multer({
    storage,
    fileFilter,
})

function handleImageUpload(req, res, next) {
    if (!req.files) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    next();
}

export { fileMiddleware, handleImageUpload }