import mongoose from "mongoose"

const commentSchema = mongoose.Schema({
    userId: mongoose.ObjectId,

    comment: String
})

const schema = mongoose.Schema({
    description: String,

    imageUrl: String,

    videoUrl: String,

    likes: [mongoose.ObjectId],

    comments: [commentSchema]
})

export default mongoose.model("Post", schema)