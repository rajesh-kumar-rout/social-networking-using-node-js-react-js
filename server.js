import { config } from "dotenv"
import express from "express"
import { authenticate } from "./middlewares/authentication.js"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import cors from "cors"

config()

const app = express()

app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(authenticate)

app.use("/api/users", authenticate, userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", authenticate, postRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
