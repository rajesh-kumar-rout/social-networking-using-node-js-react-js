import jwt from "jsonwebtoken"
import { config } from "dotenv"

config()

export function authenticate(req, res, next) {
    const { authorization } = req.headers

    const accessToken = authorization && authorization.startsWith("Bearer ") 
        ? authorization.substring(7, authorization.length) : null

    try {
        const { currentUserId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRECT)
        req.currentUserId = currentUserId
        next()
    } catch{
        res.status(401).json({ message: "Unauthenticated" })
    }
}