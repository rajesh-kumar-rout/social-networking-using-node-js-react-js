import { Router } from "express"
import { body, param } from "express-validator"
import { destroy, upload } from "../utils/cloudinary.js"
import { fetch, query } from "../utils/database.js"
import { checkValidationError, isBase64Img } from "../utils/validation.js"

const routes = Router()

routes.get("/feeds", async (req, res) => {
    const { currentUserId } = req.session

    const posts = await query("SELECT social_posts.id, social_posts.userId, social_posts.desc, social_posts.imgUrl, social_posts.createdAt, social_users.name AS userName, social_users.profileImgUrl, (CASE WHEN social_users.id = :currentUserId THEN 1 ELSE 0 END) AS isPosted, EXISTS(SELECT 1 FROM social_likes WHERE social_likes.postId = social_posts.id AND social_likes.userId = :currentUserId) AS isLiked, (SELECT COUNT(*) FROM social_comments WHERE social_comments.postId = social_posts.id) AS totalComments, (SELECT COUNT(*) FROM social_likes WHERE social_likes.postId = social_posts.id) AS totalLikes FROM social_followers INNER JOIN social_users ON social_users.id = social_followers.followingId INNER JOIN social_posts ON social_posts.userId = social_users.id WHERE followerId = :currentUserId", { currentUserId })

    res.json(posts)
})

routes.get(
    "/:postId/comments",

    param("postId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.session

        const { postId } = req.params

        const comments = await query('SELECT social_comments.id, social_comments.comment, social_comments.createdAt, social_users.name AS userName, social_users.profileImgUrl, ( CASE WHEN social_comments.userId = ? THEN 1 ELSE 0 END ) AS isCommented FROM social_comments INNER JOIN social_users ON social_users.id = social_comments.userId WHERE social_comments.postId = ?', [currentUserId, postId])

        res.json(comments)
    }
)

routes.post(
    "/",

    body("desc")
        .optional()
        .isLength({ max: 255 })
        .default(""),

    body("img")
        .optional()
        .isString()
        .custom(isBase64Img),

    checkValidationError,

    async (req, res) => {
        const { desc, img } = req.body

        const { currentUserId } = req.session

        if (!desc && !img) {
            return res.status(400).json({ message: "Either des or image is required" })
        }

        let imgUrl = null, imgId = null

        if (img) {
            let imgRes = await upload(img)
            imgUrl = imgRes.secure_url
            imgId = imgRes.public_id
        }

        await query("INSERT INTO social_posts (`desc`, imgUrl, imgId, userId) VALUES (?, ?, ?, ?)", [desc, imgUrl, imgId, currentUserId])

        res.status(201).json({ message: "Post added successfully" })
    }
)

routes.post(
    "/:postId/comments",

    param("postId").isInt(),

    body("comment").isLength({ min: 1, max: 255 }),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const { currentUserId } = req.session

        const { comment } = req.body

        if (!await fetch('SELECT 1 FROM social_posts WHERE id = ? LIMIT 1', [postId])) {
            return res.status(409).json({ message: "Post not found" })
        }

        const { insertId } = await query('INSERT INTO social_comments (userId, comment, postId) VALUES (?, ?, ?)', [currentUserId, comment, postId])

        const newComment = await fetch('SELECT id, comment, createdAt FROM social_comments WHERE id = ?', [insertId])

        res.status(201).json(newComment)
    }
)

routes.delete("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params

    const { currentUserId } = req.session

    const { affectedRows } = await query('DELETE FROM social_comments WHERE id = ? AND userId = ?', [commentId, currentUserId])

    if (!affectedRows) {
        return res.status(404).json({ message: "Comment not found" })
    }

    res.json({ message: "Comment deleted successfully" })
})

routes.patch("/:postId/toggle-like", async (req, res) => {
    const { postId } = req.params

    const { currentUserId } = req.session

    if (!await fetch("SELECT 1 FROM social_posts WHERE id = ? LIMIT 1", [postId])) {
        return res.status(409).json({ message: "Post does not exists" })
    }

    if (await fetch("SELECT 1 FROM social_likes WHERE userId = ? AND postId = ?", [currentUserId, postId])) {
        await query("DELETE FROM social_likes WHERE postId = ? AND userId = ?", [postId, currentUserId])
        return res.json({ message: "Remove likes from post successfully" })
    }

    await query("INSERT INTO social_likes (postId, userId) VALUES (?, ?)", [postId, currentUserId])
    res.status(201).json({ message: "Like the post successfully" })
})

routes.delete(
    "/:postId",

    param("postId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const { currentUserId } = req.session

        const post = await fetch('SELECT imgId FROM social_posts WHERE id = ? AND userId = ? LIMIT 1', [postId, currentUserId])

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        if (post.imgId) {
            await destroy(post.imgId)
        }

        await query("DELETE FROM social_posts WHERE id = ? AND userId = ?", [postId, currentUserId])

        res.json({ message: "Post deleted successfully" })
    }
)

export default routes