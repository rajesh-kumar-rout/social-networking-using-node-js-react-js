import bcrypt from "bcrypt"
import crypto from "crypto"
import { config } from "dotenv"
import { Router } from "express"
import { body } from "express-validator"
import { authenticate } from "../middlewares/authentication.js"
import { destroy, upload } from "../utils/cloudinary.js"
import { fetch, query } from "../utils/database.js"
import { checkValidationError, isBase64Img } from "../utils/validation.js"

config()

const routes = Router()

routes.post(
    "/login",

    body("email").isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { email, password } = req.body

        const user = await fetch('SELECT id, password FROM social_users WHERE email = ? LIMIT 1', [email])

        if (!(user && await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ message: "Invalid email or password" })
        }

        req.session.currentUserId = user.id

        res.json({ message: "Login successfull" })
    }
)

routes.post(
    "/register",

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

        if (await fetch('SELECT 1 FROM social_users WHERE email = ? LIMIT 1', [email])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        const { insertId } = await query('INSERT INTO social_users (name, email, password) VALUES (?, ?, ?)', [name, email, await bcrypt.hash(password, 10)])

        req.session.currentUserId = insertId

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
        const { currentUserId } = req.session

        const { oldPassword, newPassword } = req.body

        const user = await fetch('SELECT password FROM social_users WHERE id = ? LIMIT 1', [currentUserId])

        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(422).json({ message: "Old password does not match" })
        }

        await query('UPDATE social_users SET password = ? WHERE id = ?', [await bcrypt.hash(newPassword, 10), currentUserId])

        res.json({ message: "Password changed successfully" })
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

    body("profileImg")
        .optional({ checkFalsy: true })
        .custom(isBase64Img),

    body("coverImg")
        .optional({ checkFalsy: true })
        .custom(isBase64Img),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.session

        const { name, email, coverImg, profileImg } = req.body

        if (await fetch('SELECT 1 FROM social_users WHERE email = ? AND id != ? LIMIT 1', [email, currentUserId])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        const user = await fetch('SELECT * FROM social_users WHERE id = ? LIMIT 1', [currentUserId])

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

        await query('UPDATE social_users SET name = ?, email = ?, profileImgUrl = ?, profileImgId = ?, coverImgUrl = ?, coverImgId = ? WHERE id = ?', [name, email, user.profileImgUrl, user.profileImgId, user.coverImgUrl, user.coverImgId, currentUserId])

        res.json({
            profileImgUrl: user.profileImgUrl,
            coverImgUrl: user.coverImgUrl
        })
    }
)

routes.get("/", async (req, res) => {
    const { currentUserId } = req.session

    const csrfToken = crypto.randomUUID()

    req.session.csrfToken = csrfToken

    const user = await fetch("SELECT id, name, email, profileImgUrl, coverImgUrl FROM social_users WHERE id = ? LIMIT 1", [currentUserId ?? null])

    res.cookie("x-csrf-token", csrfToken).json(user)
})

routes.get("/logout", (req, res) => {
    req.session.destroy()

    res.json({ message: "Logout successfull" })
})

export default routes