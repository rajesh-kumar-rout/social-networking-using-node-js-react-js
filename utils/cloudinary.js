import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({ secure: true })

export default cloudinary

export async function upload(image) {
    const res = await cloudinary.uploader.upload(image)
    
    return {
        imageUrl: res.secure_url,
        imageId: res.public_id
    }
}

export const destroy = cloudinary.uploader.destroy

