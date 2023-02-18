import { Router } from "express"
import { param } from "express-validator"
import mongoose from "mongoose"
import Post from "../models/post.js"
import User from "../models/user.js"
import { checkValidationError } from "../utils/validation.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const { limit, query } = req.query

    let users = await User.find()
        .select({
            firstName: 1,
            lastName: 1,
            profileImage: {
                url: 1
            }
        })
        .limit(limit)

    res.json(users)
})

routes.get("/me/suggested", async (req, res) => {
    const { limit } = req.query

    const users = await User.find()
        .select({
            firstName: 1,
            lastName: 1,
            profileImage: {
                url: 1
            }
        })
        .limit(limit)

    res.json(users)
})

routes.get("/:userId", async (req, res) => {
    const { userId } = req.params

    const { _id } = req

    let user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ success: "User not found" })
    }

    user = user.toObject()

    user.totalFollowings = user.followings.length

    user.totalFollowers = user.followers.length

    user.toalPosts = await Post.count({ userId: _id })

    user.isFollowing = user.followers.some(id => id.equals(_id))

    user.followers = undefined

    user.followings = undefined

    user.password = undefined

    user.email = undefined

    res.json(user)
})

routes.get(
    "/:userId/posts",

    param("userId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { userId } = req.params

        const { _id } = req

        const posts = await Post.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "userId",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                profileImage: { url: 1 }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    description: 1,
                    image: {
                        url: 1
                    },
                    videoUrl: 1,
                    createdAt: 1,
                    totalLikes: { $size: "$likes" },
                    totalComments: { $size: "$comments" },
                    isLiked: {
                        $in: [mongoose.Types.ObjectId(_id), "$likes"]
                    },
                    user: 1
                }
            },
            {
                $unwind: "$user"
            },
            {
                $sort: { createdAt: -1 }
            }
        ])

        res.json(posts)
    }
)

routes.get(
    "/:userId/photos",

    param("userId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { userId } = req.params

        const { limit } = req.query

        const photos = await Post.find({ userId, image: { $exists: 1 } }, { image: { url: 1 } }).limit(limit)

        res.json(photos)
    }
)

routes.patch("/:userId/toggle-follow", async (req, res) => {
    const { userId } = req.params

    const { _id } = req

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    const currentUser = await User.findById(_id)

    if (user.followers.includes(_id)) {

        user.followers.pull(_id)

        currentUser.followings.pull(userId)

    } else {

        user.followers.push(_id)

        currentUser.followings.push(userId)
    }

    await user.save()

    await currentUser.save()

    res.json({ success: "Toggle the follow state successfully" })
})

routes.get("/:userId/followers", async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    const followers = await User.find({ _id: { $in: user.followers } }, {
        firstName: 1,
        lastName: 1,
        profileImage: {
            url: 1
        }
    })

    res.json(followers)
})

routes.get("/:userId/followings", async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    const followings = await User.find({ _id: { $in: user.followings }, profileImage: { $exists: 1 } }, {
        firstName: 1,
        lastName: 1,
        profileImage: {
            url: 1
        }
    })

    res.json(followings)
})

export default routes