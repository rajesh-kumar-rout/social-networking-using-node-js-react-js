import { createPool } from "mysql2/promise"
import { config } from "dotenv"

config()

const pool = createPool({
    connectionLimit: 1,
    namedPlaceholders: true,
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})

export const fetch = async(sql, params) => {
    const [result] = await pool.execute(sql, params);
    return result?.[0]
}

export const query = async(sql, params) => {
    const [result] = await pool.execute(sql, params)
    return result
}


