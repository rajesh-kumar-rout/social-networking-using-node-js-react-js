import { Router } from "express"
import { fetch, query } from "../database/connection.js"
import { param } from "express-validator"

const routes = Router()

routes.get("/", async (req, res) => {
    const users = await query('SELECT social_users.id, social_users.name, social_users.profileImgUrl FROM social_users')

    res.json(users)
})

routes.get("/:userId", async (req, res) => {
    const { userId } = req.params
    const { currentUserId } = req

    const user = await fetch("SELECT social_users.id, social_users.name, social_users.profileImgUrl, social_users.coverImgUrl, (SELECT COUNT(social_followers.followerId) FROM social_followers WHERE followingId = social_users.id) AS totalFollowers, (SELECT COUNT(social_followers.followingId) FROM social_followers WHERE social_followers.followingId = social_users.id) AS totalFollowings, (SELECT COUNT(social_posts.id) FROM social_posts WHERE social_posts.userId = social_users.id ) AS totalPosts, EXISTS( SELECT 1 FROM social_followers WHERE social_followers.followerId = ? AND social_followers.followingId = social_users.id) isFollowing FROM social_users WHERE id = ? LIMIT 1", [currentUserId, userId])

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
})

routes.get("/:userId/posts", async (req, res) => {
    const { userId } = req.params
    const { currentUserId } = req

    const posts = await query("SELECT social_posts.id, social_posts.desc, social_posts.imgUrl, social_posts.createdAt, social_users.name AS userName, social_users.profileImgUrl, ( SELECT COUNT(social_comments.id) FROM social_comments WHERE social_comments.postId = social_posts.id ) AS totalComments, ( SELECT COUNT(social_likes.postId) FROM social_likes WHERE social_likes.postId = social_posts.id ) AS totalLikes, EXISTS( SELECT 1 FROM social_likes WHERE social_likes.userId = :currentUserId AND social_likes.postId = social_posts.id ) AS isLiked, ( CASE WHEN social_users.id = :currentUserId THEN TRUE ELSE FALSE END ) AS isPosted FROM social_users INNER JOIN social_posts ON social_posts.userId = social_users.id WHERE social_users.id = :userId ORDER BY social_posts.id DESC", { currentUserId, userId })

    res.json(posts)
})

routes.patch("/:userId/toggle-follow", async (req, res) => {
    const { userId } = req.params
    const { currentUserId } = req

    if (!await fetch('SELECT 1 FROM social_users WHERE id = :userId LIMIT 1', { userId })) {
        return res.status(404).json({ message: "User not found" })
    }

    if (await fetch('SELECT 1 FROM social_followers WHERE followerId = ? AND followingId = ?', [currentUserId, userId])) {
        await query('DELETE FROM social_followers WHERE followerId = ? AND followingId = ?', [currentUserId, userId])
        return res.json({ message: "Unfollow the user successfully" })
    }

    if (userId == currentUserId) {
        return res.status(400).json({ message: "You can not follow yourself" })
    }

    await query('INSERT INTO social_followers (followerId, followingId) VALUES (?, ?)', [currentUserId, userId])

    res.status(201).json({ message: "Follow the user successfully" })
})

routes.get("/:userId/followers", async (req, res) => {
    const { userId } = req.params

    const users = await query("SELECT social_users.id, social_users.name, social_users.profileImgUrl FROM social_followers INNER JOIN social_users ON social_users.id = social_followers.followerId WHERE social_followers.followingId = ?", [userId])

    res.json(users)
})

routes.get("/:userId/followings", async (req, res) => {
    const { userId } = req.params

    const users = await query("SELECT social_users.id, social_users.name, social_users.profileImgUrl FROM social_followers INNER JOIN social_users ON social_users.id = social_followers.followingId WHERE social_followers.followerId = ?", [userId])

    res.json(users)
})

export default routes