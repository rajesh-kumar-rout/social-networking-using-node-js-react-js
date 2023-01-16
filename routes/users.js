import { Router } from "express"
import knex from "../utils/database.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const { query } = req.query

    const users = await knex("socialUsers")
        .whereLike("name", `%${query}%`)
        .select(
            "id",
            "name",
            "profileImgUrl"
        )

    res.json(users)
})

routes.get("/me/suggested", async (req, res) => {
    const { currentUserId } = req

    const users = await knex("socialUsers")
        .whereNot({ id: currentUserId })
        .select(
            "id",
            "name",
            "profileImgUrl"
        )

    res.json(users)
})

routes.get("/:userId", async (req, res) => {
    const { userId } = req.params

    const { currentUserId } = req

    const user = await knex("socialUsers")
        .where({ id: userId })
        .select(
            "socialUsers.id",
            "socialUsers.name",
            "socialUsers.profileImgUrl",
            "socialUsers.coverImgUrl",
            "socialUsers.work",
            "socialUsers.college",
            "socialUsers.school",
            "socialUsers.currentAddress",
            "socialUsers.permanentAddress",
            "socialUsers.relationship",
            "socialUsers.createdAt",
            "socialUsers.gender",
            "socialUsers.birthDate",

            knex("socialFollowers")
                .whereColumn("socialUsers.id", "socialFollowers.followerId")
                .count()
                .as("totalFollowings"),

            knex("socialFollowers")
                .whereColumn("socialUsers.id", "socialFollowers.followingId")
                .count()
                .as("totalFollowers"),

            knex("socialPosts")
                .whereColumn("socialUsers.id", "socialPosts.userId")
                .count()
                .as("totalPosts"),

            knex.raw(
                "EXISTS(?) AS isFollowing",
                [
                    knex("socialFollowers")
                        .where("socialFollowers.followerId", currentUserId)
                        .where("socialFollowers.followingId", userId)
                        .select(1)
                        .limit(1)
                ]
            )
        )
        .first()

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

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
                        .limit(1)
                ]
            ),

            knex.raw("IF(socialUsers.id = ?, 1, 0) AS isPosted", [currentUserId])
        )
        .orderBy("socialPosts.createdAt", "desc")

    res.json(posts)
})

routes.get("/:userId/photos", async (req, res) => {
    const { userId } = req.params

    const { limit } = req.query

    const photos = await knex("socialPosts")
        .where({ userId })
        .whereNotNull("imgUrl")
        .limit(limit)
        .orderBy("id", "desc")
        .select("imgUrl")

    res.json(photos)
})

routes.patch("/:userId/toggle-follow", async (req, res) => {
    const { userId } = req.params

    const { currentUserId } = req

    const isUserExists = await knex("socialUsers")
        .where({ id: userId })
        .first()

    if (!isUserExists) {
        return res.status(404).json({ error: "User not found" })
    }

    const isFollowing = await knex("socialFollowers")
        .where({ followerId: currentUserId })
        .where({ followingId: userId })
        .first()

    if (await isFollowing) {
        await knex("socialFollowers")
            .where({ followerId: currentUserId })
            .where({ followingId: userId })
            .del()

        return res.json({ success: "Unfollow the user successfully" })
    }

    if (userId == currentUserId) {
        return res.status(400).json({ error: "You can not follow yourself" })
    }

    await knex("socialFollowers").insert({
        followerId: currentUserId,
        followingId: userId
    })

    res.status(201).json({ success: "Follow the user successfully" })
})

routes.get("/:userId/followers", async (req, res) => {
    const { userId } = req.params

    const users = await knex("socialFollowers")
        .where("socialFollowers.followingId", userId)
        .join("socialUsers", "socialUsers.id", "socialFollowers.followerId")
        .select(
            "socialUsers.id",
            "socialUsers.name",
            "socialUsers.profileImgUrl",
        )

    res.json(users)
})

routes.get("/:userId/followings", async (req, res) => {
    const { userId } = req.params

    const { limit } = req.query

    const users = await knex("socialFollowers")
        .where("socialFollowers.followerId", userId)
        .join("socialUsers", "socialUsers.id", "socialFollowers.followingId")
        .limit(limit)
        .select(
            "socialUsers.id",
            "socialUsers.name",
            "socialUsers.profileImgUrl",
        )

    res.json(users)
})

export default routes