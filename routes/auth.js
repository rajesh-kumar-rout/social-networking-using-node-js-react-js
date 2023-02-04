import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { Router } from "express"
import { body } from "express-validator"
import jwt from "jsonwebtoken"
import { isAuthenticated } from "../middlewares/authentication.js"
import Post from "../models/post.js"
import User from "../models/user.js"
import { destroy, upload } from "../utils/cloudinary.js"
import { checkValidationError } from "../utils/validation.js"

dotenv.config()

const routes = Router()

routes.post(
    "/login",

    body("email").isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!(user && await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ error: "Invalid email or password" })
        }

        const authToken = jwt.sign(
            {
                _id: user.id
            },
            process.env.AUTH_TOKEN_SECRECT,
            {
                expiresIn: "72h"
            }
        )

        res.json({ authToken })
    }
)

routes.post(
    "/register",

    body("firstName")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 30 }),

    body("lastName")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail()
        .isLength({ max: 30 }),

    body("work")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("school")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("college")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("currentCity")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("homeTown")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("bio")
        .isString()
        .trim()
        .isLength({ max: 255 }),

    body("gender").isIn(["Male", "Female", "Others"]),

    body("relationship").isIn(["Single", "Married", "In a relationship"]),

    body("birthDate").optional({ checkFalsy: true }).isDate(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { firstName, lastName, email, work, school, college, currentCity, homeTown, birthDate, profileImage, coverImage,
            relationship, gender, bio, password } = req.body

        if (await User.findOne({ email })) {
            return res.status(409).json({ error: "Email already taken" })
        }

        const user = new User({
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, 10),
            bio,
            birthDate,
            work,
            currentCity,
            homeTown,
            school,
            college,
            relationship,
            gender
        })

        if (profileImage) {
            const image = await upload(profileImage)

            user.profileImage = image
        }

        if (coverImage) {
            const image = await upload(coverImage)

            user.coverImage = image
        }

        await user.save();

        user.password = undefined

        const authToken = jwt.sign(
            {
                _id: user.id
            },
            process.env.AUTH_TOKEN_SECRECT,
            {
                expiresIn: "72h"
            }
        )

        res.status(201).json({
            user,
            authToken
        })
    }
)

routes.patch(
    "/change-password",

    isAuthenticated,

    body("oldPassword").isLength({ min: 6, max: 20 }),

    body("newPassword").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { _id } = req

        const { oldPassword, newPassword } = req.body

        const user = await User.findById(_id)

        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(422).json({ error: "Old password does not match" })
        }

        user.password = await bcrypt.hash(newPassword, 10)

        await user.save()

        res.json({ success: "Password changed successfully" })
    }
)

routes.patch(
    "/edit-profile",

    isAuthenticated,

    body("firstName")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("lastName")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail()
        .isLength({ max: 30 }),

    body("work")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("school")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("college")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("currentCity")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("homeTown")
        .isString()
        .trim()
        .isLength({ max: 30 }),

    body("bio")
        .isString()
        .trim()
        .isLength({ max: 255 }),

    body("gender").isIn(["Male", "Female", "Others"]),

    body("relationship").isIn(["Single", "Married", "In a relationship"]),

    body("birthDate").optional({ checkFalsy: true }).isDate(),

    checkValidationError,

    async (req, res) => {
        const { _id } = req

        const { firstName, lastName, email, work, school, college, currentCity, homeTown, birthDate, relationship, gender, bio,
            coverImage, profileImage } = req.body

        if (await User.findOne({ email, _id: { $ne: _id } })) {
            return res.status(409).json({ error: "Email already taken" })
        }

        const user = await User.findById(_id)

        if (coverImage) {

            if (user.coverImage) {
                await destroy(user.coverImage.id)
            }

            user.coverImage = await upload(coverImage) 
        }

        if (profileImage) {

            if (user.profileImage) {
                await destroy(user.profileImage.id)
            }

            user.profileImage = await upload(profileImage)
        }

        user.firstName = firstName

        user.lastName = lastName

        user.email = email

        user.bio = bio

        user.birthDate = birthDate

        user.work = work

        user.currentCity = currentCity

        user.homeTown = homeTown

        user.school = school

        user.college = college

        user.relationship = relationship

        user.gender = gender

        await user.save();

        user.password = undefined

        user.followings = undefined

        user.followers = undefined

        res.json(user)
    }
)

routes.get("/", async (req, res) => {
    const { _id } = req

    const user = await User.findById(_id, {
        password: 0,
        followers: 0,
        followings: 0
    })

    res.json(user)
})

routes.delete("/", isAuthenticated, async (req, res) => {
    const { _id } = req

    const user = await User.findById(_id)

    if(user.profileImage) {
        await destroy(user.profileImage.id)
    }

    if(user.coverImage) {
        await destroy(user.coverImage.id)
    }

    await user.delete()

    await Post.deleteMany({ userId: _id })

    await Post.updateMany({ likes: _id }, { $pull: { likes: _id } })

    await Post.updateMany({ comments: { $elemMatch: { userId: _id } } }, { $pull: { comments: { userId: _id } } })

    await User.updateMany({ followers: _id }, { $pull: { followers: _id } })

    await User.updateMany({ followings: _id }, { $pull: { followings: _id } })

    res.json({ success: "Account deleted successfull" })
})

export default routes
