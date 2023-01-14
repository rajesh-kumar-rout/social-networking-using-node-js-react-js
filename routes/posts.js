import { Router } from "express"
import { body, param } from "express-validator"
import knex from "../utils/database.js"
import { destroy, upload } from "../utils/cloudinary.js"
import { checkValidationError, isBase64Img } from "../utils/validation.js"

const routes = Router()

routes.get("/feeds", async (req, res) => {
    const { currentUserId } = req

    const posts = await knex("socialFollowers")
        .where("socialFollowers.followerId", currentUserId)
        .join("socialUsers", "socialUsers.id", "socialFollowers.followingId")
        .join("socialPosts", "socialPosts.userId", "socialUsers.id")
        .select(
            "socialPosts.id",
            "socialPosts.desc",
            "socialPosts.imgUrl",
            "socialPosts.createdAt",
            "socialPosts.userId",
            "socialUsers.name AS userName",
            "socialUsers.profileImgUrl",

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
                        .whereColumn("socialUsers.id", "socialLikes.userId")
                        .select(1)
                ]
            ),

            knex.raw("0 AS isPosted")
        )
        .orderBy("socialPosts.createdAt", "desc")

    res.json(posts)
})

routes.get("/:postId/comments", async (req, res) => {
    const { currentUserId } = req

    const { postId } = req.params

    const comments = await knex("socialComments")
        .where({ postId })
        .join("socialUsers", "socialUsers.id", "socialComments.userId")
        .select(
            "socialUsers.id AS userId",
            "socialUsers.name AS userName",
            "socialUsers.profileImgUrl",
            "socialComments.id",
            "socialComments.comment",
            "socialComments.createdAt",

            knex.raw(
                "IF(socialComments.userId = ?, 1, 0) AS isCommented",
                [currentUserId]
            )
        )

    res.json(comments)
})

routes.post(
    "/",

    body("desc")
        .optional()
        .isLength({ max: 255 })
        .default(""),

    body("img")
        .optional({ checkFalsy: true })
        .isString()
        .custom(isBase64Img),

    checkValidationError,

    async (req, res) => {
        const { desc, img } = req.body

        const { currentUserId } = req

        if (!desc && !img) {
            return res.status(422).json({ error: "Either des or image is required" })
        }

        let imgUrl = null, imgId = null

        if (img) {
            let imgRes = await upload(img)
            imgUrl = imgRes.secure_url
            imgId = imgRes.public_id
        }

        await knex("socialPosts").insert({
            desc,
            imgUrl,
            imgId,
            userId: currentUserId
        })

        res.status(201).json({ success: "Post added successfully" })
    }
)

routes.post(
    "/:postId/comments",

    param("postId").isInt(),

    body("comment").isLength({ min: 1, max: 255 }),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const { currentUserId } = req

        const { comment } = req.body

        const isPostExists = await knex("socialPosts")
            .where({ id: postId })
            .first()

        if (!isPostExists) {
            return res.status(409).json({ error: "Post not found" })
        }

        const [insertId] = await knex("socialComments").insert({
            comment,
            userId: currentUserId,
            postId
        })

        const newComment = await knex("socialComments")
            .where("socialComments.id", insertId)
            .join("socialUsers", "socialUsers.id", "socialComments.userId")
            .select(
                "socialUsers.id AS userId",
                "socialUsers.name AS userName",
                "socialUsers.profileImgUrl",
                "socialComments.id",
                "socialComments.comment",
                "socialComments.createdAt",
                knex.raw("1 AS isCommented")
            )
            .first()

        res.status(201).json(newComment)
    }
)

routes.delete("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params

    const { currentUserId } = req

    const rowAffected = await knex("socialComments")
        .where({ id: commentId })
        .where({ userId: currentUserId })
        .del()

    if (rowAffected === 0) {
        return res.status(404).json({ error: "Comment not found" })
    }

    res.json({ success: "Comment deleted successfully" })
})

routes.patch("/:postId/toggle-like", async (req, res) => {
    const { postId } = req.params

    const { currentUserId } = req

    const isPostExists = await knex("socialPosts")
        .where({ id: postId })
        .first()

    if (!isPostExists) {
        return res.status(409).json({ message: "Post does not exists" })
    }

    const isLiked = await knex("socialLikes")
        .where({ userId: currentUserId })
        .where({ postId })
        .first()



    if (await isLiked) {
        await knex("socialLikes")
            .where({ userId: currentUserId })
            .where({ postId })
            .del()

        return res.json({ success: "Remove likes from post successfully" })
    }

    await knex("socialLikes").insert({
        userId: currentUserId,
        postId
    })

    res.status(201).json({ success: "Like the post successfully" })
})

routes.delete("/:postId", async (req, res) => {
    const { postId } = req.params

    const { currentUserId } = req

    const post = await knex("socialPosts")
        .where({ id: postId })
        .where({ userId: currentUserId })
        .first()

    if (!post) {
        return res.status(404).json({ error: "Post not found" })
    }

    if (post.imgId) {
        await destroy(post.imgId)
    }

    await knex("socialPosts")
        .where({ id: postId })
        .where({ userId: currentUserId })
        .del()

    res.json({ success: "Post deleted successfully" })
})

export default routes