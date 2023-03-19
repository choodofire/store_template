import multer from 'multer'

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "images/avatars")
    },
    filename(req, file, cb) {
        cb(null, req.session.user.email + ".png")
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']


const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage,
    fileFilter,
})

export default upload