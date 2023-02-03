import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export async function authenticate(req, res, next) {

    const { authorization } = req.headers

    if (authorization?.startsWith("Bearer ")) {

        authorization = authorization.substring(7, authorization.length)
    }

    const { _id } = jwt.verify(authorization, process.env.AUTH_TOKEN_SECRECT)

    req._id = _id

    next()
}

export async function isAuthenticated(req, res, next) {

    if (!req._id) {

        return res.status(401).json({ error: "Authentication failed" })
    }

    next()
}