import bcrypt from "bcrypt"
import crypto from "crypto"
import { config } from "dotenv"
import { Router } from "express"
import { body } from "express-validator"
import { isAuthenticated } from "../middlewares/authentication.js"
import { destroy, upload } from "../utils/cloudinary.js"
import knex from "../utils/database.js"
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

        const user = await knex("socialUsers")
            .where({ email })
            .first()

        if (!(user && await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ error: "Invalid email or password" })
        }

        const token = crypto.randomUUID()

        await knex("socialTokens").insert({
            userId: user.id,
            token
        })

        res.json({ token })
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

        const isEmailTaken = await knex("socialUsers")
            .where({ email })
            .first()

        if (isEmailTaken) {
            return res.status(409).json({ error: "Email already taken" })
        }

        const [userId] = await knex("socialUsers").insert({
            name,
            email,
            password: await bcrypt.hash(password, 10)
        })

        const token = crypto.randomUUID()

        await knex("socialTokens").insert({
            userId,
            token
        })

        res.status(201).json({ token })
    }
)

routes.patch(
    "/change-password",

    isAuthenticated,

    body("oldPassword").isLength({ min: 6, max: 20 }),

    body("newPassword").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req

        const { oldPassword, newPassword } = req.body

        const user = await knex("socialUsers")
            .select("password")
            .where({ id: currentUserId })
            .first()

        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(422).json({ error: "Old password does not match" })
        }

        await knex("socialUsers")
            .where({ id: currentUserId })
            .update({
                password: await bcrypt.hash(newPassword, 10)
            })


        res.json({ success: "Password changed successfully" })
    }
)

routes.patch(
    "/edit-account",

    isAuthenticated,

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
        const { currentUserId } = req

        const { name, email, coverImg, profileImg } = req.body

        const isEmailTaken = await knex("socialUsers")
            .where({ email })
            .whereNot({ id: currentUserId })
            .first()

        if (isEmailTaken) {
            return res.status(409).json({ error: "Email already taken" })
        }

        const user = await knex("socialUsers")
            .where({ id: currentUserId })
            .first()

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

        await knex("socialUsers")
            .where({ id: currentUserId })
            .update({
                name,
                email,
                profileImgUrl: user.profileImgUrl,
                profileImgId: user.profileImgUrl,
                coverImgId: user.coverImgId,
                coverImgUrl: user.coverImgUrl
            })

        res.json({
            profileImgUrl: user.profileImgUrl,
            coverImgUrl: user.coverImgUrl
        })
    }
)

routes.get("/", async (req, res) => {
    const token = req.headers.authorization ?? null

    const user = await knex("socialTokens")
        .where({ token  })
        .join("socialUsers", "socialUsers.id", "socialTokens.userId")
        .select(
            "socialUsers.id",
            "socialUsers.name",
            "socialUsers.email",
            "socialUsers.createdAt",
            "socialUsers.updatedAt",
        )
        .first()

    res.json(user)
})

routes.get("/logout", isAuthenticated, async (req, res) => {
    const token = req.headers.authorization ?? null

    await knex("socialTokens")
        .where({ token })
        .del()

    res.json({ success: "Logout successfull" })
})

export default routes