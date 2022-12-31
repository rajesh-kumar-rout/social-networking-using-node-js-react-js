import { validationResult } from "express-validator"

export const checkValidationError = (req, res, next) => {
    const errors = validationResult(req).array()

    if (errors.length) {
        return res.status(422).json(errors)
    }

    next()
}
