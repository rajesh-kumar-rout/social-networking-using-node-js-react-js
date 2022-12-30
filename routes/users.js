import { Router } from "express"
import { fetch, query } from "../database/connection.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const users = await query('SELECT users.id, users.name, users.profileImgUrl FROM users')

    res.json(users)
})

routes.get("/:userId", async (req, res) => {
    const { userId } = req.params
    const { currentUserId } = req.local

    const user = await fetch(`SELECT users.id, users.name, users.profileImgUrl, users.coverImgUrl, (SELECT COUNT(followers.followerId) FROM followers WHERE followingId = users.id) AS totalFollowers, (SELECT COUNT(followers.followingId) FROM followers WHERE followers.followingId = users.id) AS totalFollowings, (SELECT COUNT(posts.id) FROM posts WHERE posts.userId = users.id) AS totalPosts, EXISTS(SELECT 1 FROM followers WHERE followers.followerId = ? AND followers.followingId = users.id) isFollowing FROM users WHERE id = ? LIMIT 1`, [currentUserId, userId])

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
})

routes.get("/:userId/posts", async (req, res) => {
    const { userId } = req.params
    const { currentUserId } = req.local

    const posts = await query(`SELECT posts.id, posts.desc, posts.imgUrl, posts.createdAt, users.name AS userName, users.profileImgUrl, (SELECT COUNT(comments.id) FROM comments WHERE comments.postId = posts.id) AS totalComments, (SELECT COUNT(likes.postId) FROM likes WHERE likes.postId = posts.id) AS totalLikes, EXISTS(SELECT 1 FROM likes WHERE likes.userId = :currentUserId AND likes.postId = posts.id) AS isLiked, (CASE WHEN users.id = :currentUserId THEN TRUE ELSE FALSE END) AS isPosted FROM users INNER JOIN posts ON posts.userId = users.id WHERE users.id = :userId ORDER BY posts.id DESC`, { currentUserId, userId })

    res.json(posts)
})

routes.patch("/:userId/toggleFollow", async (req, res) => {
    const { userId } = req.params
    const { currentUserId } = req.local

    if (!await fetch('SELECT 1 FROM users WHERE id = :userId LIMIT 1', { userId })) {
        return res.status(404).json({ message: "User not found" })
    }

    if (await fetch('SELECT 1 FROM followers WHERE followerId = ? AND followingId = ?', [currentUserId, userId])) {
        await query('DELETE FROM followers WHERE followerId = ? AND followingId = ?', [currentUserId, userId])
        return res.json({ message: "Unfollow the user successfully" })
    }

    if (userId === currentUserId) {
        return res.status(400).json({ message: "You can not follow yourself" })
    }

    await query('INSERT INTO followers (followerId, followingId) VALUES (?, ?)', [currentUserId, userId])
    res.status(201).json({ message: "Follow the user successfully" })
})

routes.get("/:userId/followers", async (req, res) => {
    const { userId } = req.params

    const users = await query(`SELECT users.id, users.name, users.profileImgUrl FROM followers INNER JOIN users ON users.id = followers.followerId WHERE followers.followingId = ?`, [userId])

    res.json(users)
})

routes.get("/:userId/followings", async (req, res) => {
    const { userId } = req.params

    const users = await query(`SELECT users.id, users.name, users.profileImgUrl FROM followers INNER JOIN users ON users.id = followers.followingId WHERE followers.followerId = ?`, [userId])

    res.json(users)
})

export default routes