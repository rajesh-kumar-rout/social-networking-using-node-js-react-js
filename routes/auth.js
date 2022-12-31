import { Router } from "express"
import { fetch, query } from "../database/connection.js"
import { upload, destroy } from "../utils/cloudinary.js"
import { authenticate } from "../middlewares/authentication.js"
import { body } from "express-validator"
import { checkValidationError } from "../utils/validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const routes = Router()

routes.post(
    "/login",

    body("email").isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { email, password } = req.body

        const user = await fetch('SELECT id, password FROM users WHERE email = ? LIMIT 1', [email])

        if (!(user && await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ message: "Invalid email or password" })
        }

        const jwtToken = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRECT, { expiresIn: "1h" })


        res.json({ jwtToken })
    }
)

routes.post(
    "/sign-up",

    body("name")
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { name, email, password } = req.body

        if (await fetch('SELECT 1 FROM users WHERE email = ? LIMIT 1', [email])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, await bcrypt.hash(password, 10)])

        res.status(201).json({ message: "User created successfully" })
    }
)

routes.patch(
    "/change-password",

    authenticate,

    body("oldPassword").isLength({ min: 6, max: 20 }),

    body("newPassword").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { oldPassword, newPassword } = req.body

        const user = await fetch('SELECT password FROM users WHERE id = ? LIMIT 1', [currentUserId])

        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(422).json({ message: "Old password does not match" })
        }

        await query('UPDATE users SET password = ? WHERE id = ?', [await bcrypt.hash(newPassword, 10), currentUserId])

        res.json({ message: "Password changed successfully" })
    }
)

routes.get(
    "/account",

    authenticate,

    async (req, res) => {
        const { currentUserId } = req.local

        const user = await fetch('SELECT id, name, email, profileImgUrl, coverImgUrl, createdAt, updatedAt FROM users WHERE id = ? LIMIT 1', [currentUserId])

        res.json(user)
    }
)

routes.patch(
    "/edit-account",

    authenticate,

    body("name")
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { name, email, coverImg, profileImg } = req.body

        if (await fetch('SELECT 1 FROM users WHERE email = ? AND id != ? LIMIT 1', [email, currentUserId])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        const user = await fetch('SELECT * FROM users WHERE id = ? LIMIT 1', [currentUserId])

        if (coverImg) {
            const { secure_url, public_id } = await upload(coverImg)
            user.coverImgUrl && await destroy(user.coverImgId)
            user.coverImgUrl = secure_url
            user.coverImgId = public_id
        }

        if (profileImg) {
            const { secure_url, public_id } = await upload(profileImg)
            user.profileImgUrl && await destroy(user.profileImgId)
            user.profileImgUrl = secure_url
            user.profileImgId = public_id
        }

        await query('UPDATE users SET name = ?, email = ?, profileImgUrl = ?, profileImgId = ?, coverImgUrl = ?, coverImgId = ? WHERE id = ?', [name, email, user.profileImgUrl, user.profileImgId, user.coverImgUrl, user.coverImgId, currentUserId])

        res.json({
            profileImgUrl: user.profileImgUrl,
            coverImgUrl: user.coverImgUrl
        })
    }
)

export default routes