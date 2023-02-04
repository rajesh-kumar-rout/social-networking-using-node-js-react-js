import { validationResult } from "express-validator"

export function isYoutubeVideo(value) {
    return value.startsWith("https://youtu.be/")
}

export function makeYoutubeVideoUrl(value) {
    return "https://youtube.com/embed/" + value?.split("be/")[1]
}

export const checkValidationError = (req, res, next) => {
    const errors = validationResult(req).array()

    if (errors.length) {
        return res.status(422).json(errors)
    }

    next()
}
