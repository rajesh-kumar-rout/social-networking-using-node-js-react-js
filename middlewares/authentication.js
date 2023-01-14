import { config } from "dotenv"
import knex from "../utils/database.js"

config()

export async function authenticate(req, res, next) {
    const token = req.headers.authorization ?? null

    const tokenRow = await knex("socialTokens")
        .where({ token })
        .first()

    if (tokenRow) {
        req.currentUserId = tokenRow.userId
    }

    next()
}

export async function isAuthenticated(req, res, next) {
    if (!req.currentUserId) {
        return res.status(401).json({ error: "Authentication failed" })
    }

    next()
}