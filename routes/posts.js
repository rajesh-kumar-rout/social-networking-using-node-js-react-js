import { Router } from "express"
import { body, param } from "express-validator"
import mongoose, { Types } from "mongoose"
import Post from "../models/post.js"
import User from "../models/user.js"
import { destroy, upload } from "../utils/cloudinary.js"
import { checkValidationError, isYoutubeVideo, makeYoutubeVideoUrl } from "../utils/validation.js"

const routes = Router()

routes.get("/feeds", async (req, res) => {

    const { _id } = req

    const user = await User.findById(_id)

    const followings = [...user.followings, Types.ObjectId(_id)]
    console.log(followings);
    const posts = await Post.aggregate([
        {
            $match: {
                userId: { $in: followings }
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
    // const { currentUserId } = req

    // const posts = await knex("socialFollowers")
    //     .where("socialFollowers.followerId", currentUserId)
    //     .join("socialUsers", "socialUsers.id", "socialFollowers.followingId")
    //     .join("socialPosts", "socialPosts.userId", "socialUsers.id")
    //     .select(
    //         "socialPosts.id",
    //         "socialPosts.description",
    //         "socialPosts.imageUrl",
    //         "socialPosts.videoUrl",
    //         "socialPosts.createdAt",
    //         "socialPosts.userId",
    //         knex.raw("CONCAT(socialUsers.firstName, ' ', socialUsers.lastName) AS userName"),
    //         "socialUsers.profileImageUrl",

    //         knex("socialLikes")
    //             .whereColumn("socialLikes.postId", "socialPosts.id")
    //             .count()
    //             .as("totalLikes"),

    //         knex("socialComments")
    //             .whereColumn("socialComments.postId", "socialPosts.id")
    //             .count()
    //             .as("totalComments"),

    //         knex.raw(
    //             "EXISTS(?) AS isLiked",
    //             [
    //                 knex("socialLikes")
    //                     .whereColumn("socialLikes.postId", "socialPosts.id")
    //                     .whereColumn("socialLikes.userId", currentUserId)
    //                     .select(1)
    //             ]
    //         ),

    //         knex.raw("0 AS isPosted")
    //     )
    //     .orderBy("socialPosts.createdAt", "desc")

    // res.json(posts)
})

routes.get(
    "/:postId/comments",

    param("postId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { _id } = req

        const { postId } = req.params

        const comments = await Post.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(postId)
                }
            },
            {
                $unwind: "$comments"
            },
            {
                $replaceRoot: {
                    newRoot: "$comments"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                profileImage: {
                                    url: 1
                                }
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$user"
            },
            {
                $sort: { createdAt: -1 }
            }
        ])

        res.json(comments)
    }
)

routes.post("/",

    body("description")
        .optional({ checkFalsy: true })
        .isString()
        .trim()
        .isLength({ max: 255 }),

    body("image").isString(),

    body("videoUrl")
        .optional({ checkFalsy: true })
        .isURL()
        .custom(isYoutubeVideo)
        .customSanitizer(makeYoutubeVideoUrl),

    checkValidationError,

    async (req, res) => {
        const { description, image, videoUrl } = req.body

        const { _id } = req

        if (!description && !image && !videoUrl) {
            return res.status(422).json({ error: "Either desription or image or video url is required" })
        }

        if (image && videoUrl) {
            return res.status(422).json({ error: "Either provide image or video" })
        }

        const post = new Post({
            description,
            videoUrl,
            userId: _id
        })

        if (image) {
            post.image = await upload(image)
            console.log(post.image);
        }

        await post.save()

        post.comments = undefined

        post.likes = undefined

        res.status(201).json(post)
    }
)

routes.post(
    "/:postId/comments",

    param("postId").isMongoId(),

    body("comment")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 255 }),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const { _id } = req

        const { comment } = req.body

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(409).json({ error: "Post not found" })
        }

        post.comments.push({
            userId: _id,
            comment
        })

        await post.save()

        res.status(201).json({ success: "Comment added successfuly" })
    }
)

routes.delete(
    "/:postId/comments/:commentId",

    param("postId").isMongoId(),

    param("commentId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { commentId, postId } = req.params

        const { _id } = req

        await Post.updateOne({ _id: postId }, { $pull: { comments: { _id: commentId, userId: _id } } })

        res.json({ success: "Comment deleted successfully" })
    }
)

routes.patch("/:postId/toggle-like", async (req, res) => {
    const { postId } = req.params

    const { _id } = req

    const post = await Post.findById(postId)

    if (!post) {
        return res.status(404).json({ error: "Post does not exists" })
    }

    if (post.likes.includes(_id)) {
        post.likes.pull(_id)
    } else {
        post.likes.push(_id)
    }

    await post.save()

    res.json({ success: "Toggle like state successfully" })
})

routes.delete(
    "/:postId",

    param("postId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const { _id } = req

        const post = await Post.findOne({ _id: postId, userId: _id })

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if (post.image) {
            await destroy(post.image.id)
        }

        await post.delete()

        res.json({ success: "Post deleted successfully" })
    }
)

export default routes
