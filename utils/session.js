import session from "express-session"
import expressMysqlSession from "express-mysql-session"
import { pool } from "./database.js"

const option = {
    schema: {
        tableName: "social_session"
    }
}

const MysqlSessionStorage = expressMysqlSession(session)

const sessionStorage = new MysqlSessionStorage(option, pool)

export default session({
    store: sessionStorage,
    secret: process.env.SESSION_SECRECT,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 2629746000
    }
})