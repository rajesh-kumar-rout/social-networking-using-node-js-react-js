import { config } from "dotenv"
import knex from "knex"

config()

export default knex({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    pool: {
        min: 1,
        max: 1
    },
    acquireConnectionTimeout: 90000
})
