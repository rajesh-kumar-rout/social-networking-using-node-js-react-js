import cors from "cors"
import { config } from "dotenv"
import express from "express"
import { authenticate, isAuthenticated } from "./middlewares/authentication.js"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"

config()

const app = express()

app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(authenticate)

app.use("/api/users", isAuthenticated, userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", isAuthenticated, postRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
