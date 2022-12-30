import { v2 as cloudinary } from "cloudinary" 
import { config } from "dotenv"

config()

cloudinary.config({ secure: true })

export default cloudinary

export const upload = cloudinary.uploader.upload

export const destroy = cloudinary.uploader.destroy

export const uploads = async (files) => {
    const res = []

    for (const { path } of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(path)

        res.push({ imgUrl: secure_url, imgId: public_id })

        await fs.unlink(path)
    }

    return res
}

