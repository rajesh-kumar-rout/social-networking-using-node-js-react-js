import { v2 as cloudinary } from "cloudinary"
import { config } from "dotenv"

config()

cloudinary.config({ secure: true })

export default cloudinary

export const upload = cloudinary.uploader.upload

export const destroy = cloudinary.uploader.destroy

