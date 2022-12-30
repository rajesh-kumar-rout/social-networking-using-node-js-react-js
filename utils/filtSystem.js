import multer, { diskStorage } from "multer"
import path from "path"

export const multipart = multer({
    storage: diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(path.resolve(), "temp"))
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        return ["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype) ? cb(null, true) : cb(new Error("File not supported"))
    },
    limits: { fileSize: 70000 }
})
