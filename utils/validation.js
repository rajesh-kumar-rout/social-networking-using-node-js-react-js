import { validationResult } from "express-validator"

export function isBase64Img(value) {
    return value.startsWith("data:image/jpeg") || value.startsWith("data:image/png") || 
        value.startsWith("data:image/jpg")
}

export const checkValidationError = (req, res, next) => {
    const errors = validationResult(req).array()

    if (errors.length) {
        return res.status(422).json(errors)
    }

    next()
}
