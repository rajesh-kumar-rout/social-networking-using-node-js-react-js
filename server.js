import express from "express"
import cors from "cors"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import { config } from "dotenv"
import { setUpRequest } from "./middlewares/setUp.js"
import { authenticate } from "./middlewares/authentication.js"

config()
const app = express()

app.set("view engine", "ejs")
app.use(express.static("views"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(setUpRequest)

app.use("/api/users", authenticate, userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", authenticate, postRoutes)

app.get("*", (req, res) => {
    res.render("index.ejs")
})

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
