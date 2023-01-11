import { config } from "dotenv"

config()

export function authenticate(req, res, next) {
    if(!req.session.currentUserId){
        return res.status(401).json({ message: "Unauthenticated" })
    }

    next()
}