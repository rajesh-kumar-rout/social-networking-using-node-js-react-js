import cors from "cors"
import { config } from "dotenv"
import express from "express"
import { authenticate, verifyCsrf } from "./middlewares/authentication.js"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import session from "./utils/session.js"
import path from "path"

config()

const app = express()

app.set("trust proxy", 1)
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))
app.use(express.static("view"))
app.use(session)
app.use(verifyCsrf)
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/api/users", authenticate, userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", authenticate, postRoutes)

app.get("*", (req, res) => {
    res.sendFile(path.join(path.resolve(), "view/index.html"))
})

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
