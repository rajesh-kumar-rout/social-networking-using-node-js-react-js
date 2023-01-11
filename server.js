import express from "express"
import cors from "cors"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import { config } from "dotenv"
import { authenticate } from "./middlewares/authentication.js"
import session from "./utils/session.js"

config()

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))
app.use(session)
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/api/users", authenticate, userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", authenticate, postRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
