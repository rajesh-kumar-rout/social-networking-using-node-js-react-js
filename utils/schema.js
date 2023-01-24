import knex from "./database.js"

export default async function seed() {

    await knex.schema.createTable("socialUsers", table => {
        table.increments()
        table.string("firstName").notNullable()
        table.string("lastName").notNullable()
        table.string("bio").notNullable()
        table.string("email").notNullable().unique()
        table.string("password").notNullable()
        table.string("work")
        table.string("currentCity")
        table.string("homeTown")
        table.string("school")
        table.string("college")
        table.string("gender")
        table.string("relationship")
        table.string("birthDate")
        table.string("profileImageUrl")
        table.string("profileImageId")
        table.string("coverImageUrl")
        table.string("coverImageId")
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.timestamp("updatedAt").defaultTo(knex.fn.now())
    })

    await knex.schema.createTable("socialTokens", table => {
        table.increments()
        table.integer("userId").notNullable()
        table.string("token").notNullable()
        table.foreign("userId").references("id").inTable("socialUsers").onDelete("cascade").onDelete("cascade")
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })

    await knex.schema.createTable("socialPosts", table => {
        table.increments()
        table.string("description")
        table.string("imageUrl")
        table.string("imageId")
        table.string("videoUrl")
        table.integer("userId").notNullable()
        table.foreign("userId").references("id").inTable("socialUsers").onDelete("cascade").onDelete("cascade")
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })

    await knex.schema.createTable("socialComments", table => {
        table.increments()
        table.string("comments")
        table.integer("userId").notNullable()
        table.foreign("userId").references("id").inTable("socialUsers").onDelete("cascade").onDelete("cascade")
        table.integer("postId").notNullable();
        table.foreign("postId").references("id").inTable("socialPosts").onDelete("cascade").onDelete("cascade")
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })

    await knex.schema.createTable("socialLikes", table => {
        table.increments()
        table.integer("userId").notNullable()
        table.foreign("userId").references("id").inTable("socialUsers").onDelete("cascade").onDelete("cascade")
        table.integer("postId").notNullable()
        table.foreign("postId").references("id").inTable("socialPosts").onDelete("cascade").onDelete("cascade")
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })

    await knex.schema.createTable("socialFollowers", table => {
        table.increments()
        table.integer("followerId").notNullable()
        table.foreign("followerId").references("id").inTable("socialUsers").onDelete("cascade").onDelete("cascade")
        table.integer("followingId").notNullable()
        table.foreign("followingId").references("id").inTable("socialUsers").onDelete("cascade").onDelete("cascade")
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })
}

seed()

console.log('called--');