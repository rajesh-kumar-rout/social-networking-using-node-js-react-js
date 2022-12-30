import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

let connection = null 

mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})
.then(db => {
    connection = db 
    connection.config.namedPlaceholders = true
})
.catch(error => {
    console.log(error);
})

export const fetch = async(sql, params) => {
    const [result] = await connection.execute(sql, params);
    return result?.[0]
}

export const query = async(sql, params) => {
    const [result] = await connection.execute(sql, params);
    return result
}


