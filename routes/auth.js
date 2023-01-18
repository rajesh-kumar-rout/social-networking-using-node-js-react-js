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

    body("firstName").trim().isLength({ max: 20 }),

    body("lastName").trim().isLength({ max: 20 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail()
        .isLength({ max: 30 }),

    body("work")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("school")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("college")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("currentCity")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("homeTown")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("bio").trim().isLength({ max: 255 }),

    body("gender").notEmpty().isIn(["Male", "Female", "Others"]),

    body("relationship").notEmpty().isIn(["Single", "Married", "In a relationship"]),

    body("birthDate").optional().isDate(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { firstName, lastName, email, work, school, college, currentCity, homeTown, birthDate, profileImage, coverImage, relationship, gender, bio, password } = req.body

        const isEmailTaken = await knex("socialUsers")
            .where({ email })
            .first()

        if (isEmailTaken) {
            return res.status(409).json({ error: "Email already taken" })
        }

        let profileImageUrl = null, profileImageId = null

        if (profileImage) {
            const { imageUrl, imageId } = await upload(profileImage)
            profileImageUrl = imageUrl
            profileImageId = imageId
        }

        let coverImageUrl = null, coverImageId = null

        if (coverImage) {
            const { imageUrl, imageId } = await upload(coverImage)
            coverImageUrl = imageUrl
            coverImageId = imageId
        }

        const [userId] = await knex("socialUsers").insert({
            firstName,
            lastName,
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
            profileImageUrl,
            profileImageId,
            coverImageUrl,
            coverImageId,
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

    body("firstName").trim().isLength({ max: 20 }),

    body("lastName").trim().isLength({ max: 20 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail(),

    body("work")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("school")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("college")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("currentCity")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("homeTown")
        .optional()
        .trim()
        .isLength({ max: 30 }),

    body("bio").trim().isLength({ max: 255 }),

    body("gender").notEmpty().isIn(["Male", "Female", "Others"]),

    body("relationship").notEmpty().isIn(["Single", "Married", "In a relationship"]),

    body("birthDate").optional(),

    body("image").optional().isURL(),

    body("video").optional().isURL(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req

        const { firstName, lastName, email, work, school, college, currentCity, homeTown, birthDate, relationship, gender, bio, coverImage, profileImage } = req.body

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
                firstName,
                lastName,
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
                "firstName",
                "lastName",
                knex.raw("CONCAT(firstName, ' ', lastName) AS fullName"),
                "email",
                "profileImageUrl",
                "coverImageUrl",
            )
            .first()

        res.json(updatedUser)
    }
)

routes.get("/", async (req, res) => {
    const token = req.headers.authorization ?? null

    const user = await knex("socialTokens")
        .where({ token })
        .select(
            "socialUsers.id",
            "socialUsers.firstName",
            "socialUsers.lastName",
            "socialUsers.bio",
            knex.raw("CONCAT(socialUsers.firstName, ' ', socialUsers.lastName) AS fullName"),
            "socialUsers.email",
            "socialUsers.profileImageUrl",
            "socialUsers.coverImageUrl",
            knex.raw("IFNULL(socialUsers.work, '') AS work"),
            knex.raw("IFNULL(socialUsers.school, '') AS school"),
            knex.raw("IFNULL(socialUsers.college, '') AS college"),
            knex.raw("IFNULL(socialUsers.homeTown, '') AS homeTown"),
            knex.raw("IFNULL(socialUsers.currentCity, '') AS currentCity"),
            "socialUsers.gender",
            "socialUsers.relationship",
            knex.raw("IFNULL(DATE_FORMAT(socialUsers.birthDate, '%Y-%m-%d'), '') AS birthDate"),
            knex.raw("DATE_FORMAT(socialUsers.createdAt, '%Y-%m-%d') AS createdAt")
        )
        .join("socialUsers", "socialUsers.id", "socialTokens.userId")
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