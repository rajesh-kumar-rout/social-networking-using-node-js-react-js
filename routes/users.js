import { Router } from "express"
import Post from "../models/post.js"
import User from "../models/user.js"
import knex from "../utils/database.js"

const routes = Router()

routes.get("/", async (req, res) => {
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

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ success: "User not found" })
    }

    user.totalFollowings = user.followings.length

    user.totalFollowers = user.followers.length

    user.toalPosts = await Post.count({ userId: _id })

    user.isFollowing = user.followers.includes(_id)

    user.followers = undefined

    user.followings = undefined

    user.password = undefined

    user.email = undefined

    res.json(user)
})

routes.get("/:userId/posts", async (req, res) => {
    const { userId } = req.params

    const { currentUserId } = req

    const posts = await knex("socialUsers")
        .where("socialUsers.id", userId)
        .join("socialPosts", "socialPosts.userId", "socialUsers.id")
        .select(
            "socialPosts.id",
            "socialPosts.description",
            "socialPosts.imageUrl",
            "socialPosts.videoUrl",
            "socialPosts.createdAt",
            "socialPosts.userId",
            knex.raw("CONCAT(firstName, '', lastName) AS userName"),
            "socialUsers.profileImageUrl",

            knex("socialLikes")
                .whereColumn("socialLikes.postId", "socialPosts.id")
                .count()
                .as("totalLikes"),

            knex("socialComments")
                .whereColumn("socialComments.postId", "socialPosts.id")
                .count()
                .as("totalComments"),

            knex.raw(
                "EXISTS(??) AS isLiked",
                [
                    knex("socialLikes")
                        .whereColumn("socialLikes.postId", "socialPosts.id")
                        .whereColumn("socialUsers.id", "socialLikes.userId")
                        .select(1)
                        .limit(1)
                ]
            ),

            knex.raw("IIF(socialUsers.id = ?, 1, 0) AS isPosted", [currentUserId])
        )
        .orderBy("socialPosts.createdAt", "desc")

    res.json(posts)
})

routes.get("/:userId/photos", async (req, res) => {
    const { userId } = req.params

    const { limit } = req.query

    const photos = await Post.find({ userId, $ne: { image: null } }, { image: { url: 1 } }).limit(limit)

    res.json(photos)
})

routes.patch("/:userId/toggle-follow", async (req, res) => {
    const { userId } = req.params

    const { _id } = req

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    const currentUser = await User.findById(_id)

    if (user.followers.includes(_id)) {

        user.followers.pop(_id)

        currentUser.followings.pop(userId)

    } else {

        user.followers.push(_id)

        currentUser.followings.push(userId)
    }

    await user.save()

    await currentUser.save()

    res.status(201).json({ success: "Follow the user successfully" })
})

routes.get("/:userId/followers", async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)

    const followers = await User.find({ _id: { $in: user.followers } }, {
        firstName: 1,
        lastName: 1,
        image: {
            url: 1
        }
    })

    res.json(followers)
})

routes.get("/:userId/followings", async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)

    const followings = await User.find({ _id: { $in: user.followings } }, {
        firstName: 1,
        lastName: 1,
        image: {
            url: 1
        }
    })

    res.json(followings)
})

export default routes