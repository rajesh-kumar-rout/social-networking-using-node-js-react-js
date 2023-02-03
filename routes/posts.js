import { Router } from "express"
import { body, param } from "express-validator"
import Post from "../models/post.js"
import { destroy, upload } from "../utils/cloudinary.js"
import knex from "../utils/database.js"
import { checkValidationError, isYoutubeVideo, makeYoutubeVideoUrl } from "../utils/validation.js"

const routes = Router()

routes.get("/feeds", async (req, res) => {
    const { currentUserId } = req

    const posts = await knex("socialFollowers")
        .where("socialFollowers.followerId", currentUserId)
        .join("socialUsers", "socialUsers.id", "socialFollowers.followingId")
        .join("socialPosts", "socialPosts.userId", "socialUsers.id")
        .select(
            "socialPosts.id",
            "socialPosts.description",
            "socialPosts.imageUrl",
            "socialPosts.videoUrl",
            "socialPosts.createdAt",
            "socialPosts.userId",
            knex.raw("CONCAT(socialUsers.firstName, ' ', socialUsers.lastName) AS userName"),
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
                "EXISTS(?) AS isLiked",
                [
                    knex("socialLikes")
                        .whereColumn("socialLikes.postId", "socialPosts.id")
                        .whereColumn("socialLikes.userId", currentUserId)
                        .select(1)
                ]
            ),

            knex.raw("0 AS isPosted")
        )
        .orderBy("socialPosts.createdAt", "desc")

    res.json(posts)
})

routes.get("/:postId/comments", async (req, res) => {
    const { _id } = req

    const comments = await Post.aggregate([
        {
            $match: {
                _id
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
                foreignField: "id",
                as: "users",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            profileImage: {
                                url: 1
                            }
                        }
                    }
                ]
            }
        },
        {
            $replaceRoot: {
                newRoot: { $mergeObjects: [{ $arrayElemAt: ["$users", 0] }, "$$ROOT"] }
            }
        }
    ])

    res.json(comments)
})

routes.post("/",

    body("description")
        .optional()
        .trim()
        .isLength({ max: 255 }),

    body("image").optional().isString(),

    body("videoUrl")
        .optional()
        .trim()
        .isURL()
        .custom(isYoutubeVideo)
        .customSanitizer(makeYoutubeVideoUrl),

    checkValidationError,

    async (req, res) => {
        const { description, image, videoUrl } = req.body

        const { _id } = req

        if (!description && !image && !videoUrl) {
            return res.status(422).json({ error: "Either desription or image or video is required" })
        }

        if (image && videoUrl) {
            return res.status(422).json({ error: "Either provide image or video" })
        }

        const post = await Post.create({
            description,
            videoUrl
        })

        if (image) {

            const { imageUrl, imageId } = await upload(image)

            post.image.url = imageUrl

            post.image.id = imageId

            await post.save()
        }

        res.status(201).json(post)
    }
)

routes.post(
    "/:postId/comments",

    param("postId").isInt(),

    body("comment").isLength({ min: 1, max: 255 }),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const { comment } = req.body

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(409).json({ error: "Post not found" })
        }

        post.comments.push({
            userId: _id,
            comment
        })

        res.status(201).json({ success: "Comment added" })
    }
)

routes.delete("/:postId/comments/:commentId", async (req, res) => {
    const { commentId, postId } = req.params

    const { _id } = req

    await Post.updateOne({ _id: postId }, { $pull: { comments: { _id: commentId, userId: _id } } })

    res.json({ success: "Comment deleted successfully" })
})

routes.patch("/:postId/toggle-like", async (req, res) => {
    const { postId } = req.params

    const { _id } = req

    const post = await Post.findById(postId)

    if (!post) {
        return res.status(404).json({ error: "Post does not exists" })
    }

    if (post.likes.include(_id)) {
        post.likes.pull(_id)
    } else {
        post.likes.push(_id)
    }

    await post.save()

    res.status(201).json({ success: "Like the post successfully" })
})

routes.delete("/:postId", async (req, res) => {
    const { postId } = req.params

    const { _id } = req

    const post = await Post.findOne({_id: postId, userId: _id})

    if (!post) {
        return res.status(404).json({ error: "Post not found" })
    }

    if (post.image) {
        await destroy(post.image.id)
    }

    await post.delete()

    res.json({ success: "Post deleted successfully" })
})

export default routes