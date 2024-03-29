import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import { authenticate, isAuthenticated } from "./middlewares/authentication.js"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import path from "path"

dotenv.config()

mongoose.connect(process.env.MONGO_URL);

const app = express()

app.use(express.static("public"))
app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(authenticate)

app.use("/api/users", isAuthenticated, userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", isAuthenticated, postRoutes)

app.get("/*", (req, res) => {
    res.sendFile(path.resolve("public/index.html"))
})

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
