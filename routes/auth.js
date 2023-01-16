import bcrypt from "bcrypt"
import crypto from "crypto"
import { config } from "dotenv"
import { Router } from "express"
import { body } from "express-validator"
import { isAuthenticated } from "../middlewares/authentication.js"
import { destroy, upload } from "../utils/cloudinary.js"
import knex from "../utils/database.js"
import { checkValidationError } from "../utils/validation.js"

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

    body("name").trim().isLength({ min: 2, max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail()
        .isLength({ max: 30 }),

    body("work")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("school")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("college")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("currentCity")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("homeTown")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("bio").trim().isLength({ min: 2, max: 30 }),

    body("gender").notEmpty().isIn("Male", "Female", "Others"),

    body("relationship").notEmpty().isIn("Single", "Married", "In a relationship"),

    body("birthDate").optional().isDate(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { name, email, work, school, college, currentCity, homeTown, birthDate, relationship, gender, bio, password } = req.body

        const isEmailTaken = await knex("socialUsers")
            .where({ email })
            .first()

        if (isEmailTaken) {
            return res.status(409).json({ error: "Email already taken" })
        }

        const [userId] = await knex("socialUsers").insert({
            name,
            email,
            work,
            school,
            college,
            currentCity,
            homeTown,
            birthDate,
            relationship,
            gender,
            bio,
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

    body("work")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("school")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("college")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("currentCity")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("homeTown")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("bio").trim().isLength({ min: 2, max: 30 }),

    body("gender").notEmpty().isIn("Male", "Female", "Others"),

    body("relationship").notEmpty().isIn("Single", "Married", "In a relationship"),

    body("birthDate").optional().isDate(),

    body("image").optional().isURL(),

    body("video").optional().isURL(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req

        const { name, email, work, school, college, currentCity, homeTown, birthDate, relationship, gender, bio, coverImage, profileImage } = req.body

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

        if (coverImage) {
            const { imageUrl, imageId } = await upload(coverImage)
            user.coverImageUrl && await destroy(user.coverImageId)
            user.coverImageUrl = imageUrl
            user.coverImageId = imageId
        }

        if (profileImage) {
            const { imageUrl, imageId } = await upload(profileImage)
            user.profileImageUrl && await destroy(user.profileImageId)
            user.profileImageUrl = imageUrl
            user.profileImageId = imageId
        }

        await knex("socialUsers")
            .where({ id: currentUserId })
            .update({
                name,
                email,
                work,
                school,
                college,
                currentCity,
                homeTown,
                birthDate,
                relationship,
                gender,
                bio,
                profileImageUrl: user.profileImageUrl,
                profileImageId: user.profileImageId,
                coverImageUrl: user.coverImageUrl,
                coverImageId: user.coverImageId
            })

        const updatedUser = await knex("socialUsers")
            .where({ id: currentUserId })
            .select(
                "id",
                "name",
                "email"
            )
            .first()

        res.json(updatedUser)
    }
)

routes.get("/", async (req, res) => {
    const token = req.headers.authorization ?? null

    const user = await knex("socialTokens")
        .where({ token })
        .join("socialUsers", "socialUsers.id", "socialTokens.userId")
        .select(
            "socialUsers.id",
            "socialUsers.name",
            "socialUsers.email"
        )
        .first()

    res.json(user)
})

routes.delete("/logout", isAuthenticated, async (req, res) => {
    const token = req.headers.authorization ?? null

    await knex("socialTokens")
        .where({ token })
        .del()

    res.json({ success: "Logout successfull" })
})

routes.delete("/", isAuthenticated, async (req, res) => {
    const { currentUserId } = req

    await knex("socialUsers")
        .where({ id: currentUserId })
        .del()

    res.json({ success: "Account deleted successfull" })
})

export default routes