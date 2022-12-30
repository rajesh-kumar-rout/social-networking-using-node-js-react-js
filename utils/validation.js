import { buildCheckFunction, validationResult } from "express-validator"

export const checkFileMimeType = (...types) => (value) => types.includes(value.mimetype)

export const checkIsFileTruncated = (value) => !value.truncated

export const checkValidationError = (callback) => async (req, res, next) => {
    const errors = validationResult(req).array()

    if (errors.length) {
        callback && await callback(req)
        return res.status(422).json(errors)
    }

    next()
}

export const files = buildCheckFunction(["files"])