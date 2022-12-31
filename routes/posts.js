import { Router } from "express"
import { query, fetch } from "../database/connection.js"
import { body, param } from "express-validator"
import { upload, destroy } from "../utils/cloudinary.js"
import { checkValidationError } from "../utils/validation.js"

const routes = Router()

routes.get("/feeds", async (req, res) => {
    const { currentUserId } = req.local

    const posts = await query(`SELECT posts.id, posts.userId, posts.desc, posts.imgUrl, posts.createdAt, users.name AS userName, users.profileImgUrl, (CASE WHEN users.id = :currentUserId THEN 1 ELSE 0 END) AS isPosted, EXISTS(SELECT 1 FROM likes WHERE likes.postId = posts.id AND likes.userId = :currentUserId) AS isLiked, (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.id) AS totalComments, (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id) AS totalLikes FROM followers INNER JOIN users ON users.id = followers.followingId INNER JOIN posts ON posts.userId = users.id WHERE followerId = :currentUserId`, { currentUserId })

    res.json(posts)
})

routes.get(
    "/:postId/comments",

    param("postId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { currentUserId } = req.local
        const { postId } = req.params

        const comments = await query('SELECT comments.id, comments.comment, comments.createdAt, users.name AS userName, users.profileImgUrl, (CASE WHEN comments.userId = ? THEN 1 ELSE 0 END) AS isCommented FROM comments INNER JOIN users ON users.id = comments.userId WHERE comments.postId = ?', [currentUserId, postId])

        res.json(comments)
    }
)

routes.post(
    "/",

    body("desc")
        .optional()
        .isLength({ max: 255 })
        .default(""),

    checkValidationError,

    async (req, res) => {
        const { desc, img } = req.body
        const { currentUserId } = req.local

        if (!desc && !img) {
            return res.status(400).json({ message: "Either des or image is required" })
        }

        let imgUrl = null, imgId = null

        if (img) {
            let imgRes = await upload(img)
            imgUrl = imgRes.secure_url
            imgId = imgRes.public_id
        }

        await query("INSERT INTO posts (`desc`, imgUrl, imgId, userId) VALUES (?, ?, ?, ?)", [desc, imgUrl, imgId, currentUserId])

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
        const { currentUserId } = req.local
        const { comment } = req.body

        if (!await fetch('SELECT 1 FROM posts WHERE id = ? LIMIT 1', [postId])) {
            return res.status(409).json({ message: "Post not found" })
        }

        const { insertId } = await query('INSERT INTO comments (userId, comment, postId) VALUES (?, ?, ?)', [currentUserId, comment, postId])

        const newComment = await fetch('SELECT comments.id, comments.comment, comments.createdAt FROM comments WHERE id = ?', [insertId])

        res.status(201).json(newComment)
    }
)

routes.delete(
    "/comments/:commentId",

    param("commentId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { commentId } = req.params
        const { currentUserId } = req.local

        const { affectedRows } = await query('DELETE FROM comments WHERE id = ? AND userId = ?', [commentId, currentUserId])

        if (!affectedRows) {
            return res.status(404).json({ message: "Comment not found" })
        }

        res.json({ message: "Comment deleted successfully" })
    }
)

routes.patch(
    "/:postId/toggleLike",

    param("postId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params
        const { currentUserId } = req.local

        if (!await fetch('SELECT 1 FROM posts WHERE id = ? LIMIT 1', [postId])) {
            return res.status(409).json({ message: "Post does not exists" })
        }

        if (await fetch('SELECT 1 FROM likes WHERE userId = ? AND postId = ?', [currentUserId, postId])) {
            await query('DELETE FROM likes WHERE postId = ? AND userId = ?', [postId, currentUserId])
            return res.json({ message: "Dislike the post successfully" })
        }

        await query('INSERT INTO likes (postId, userId) VALUES (?, ?)', [postId, currentUserId])
        res.status(201).json({ message: "Like the post successfully" })
    }
)

routes.delete(
    "/:postId",

    param("postId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params
        const { currentUserId } = req.local

        const post = await fetch('SELECT imgId FROM posts WHERE id = ? AND userId = ? LIMIT 1', [postId, currentUserId])

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        if (post.imgId) {
            await destroy(post.imgId)
        }

        await query('DELETE FROM posts WHERE id = ? AND userId = ?', [postId, currentUserId])

        res.json({ message: "Post deleted successfully" })
    }
)

export default routes