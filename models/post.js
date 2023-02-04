import mongoose from "mongoose"

const imageSchema = mongoose.Schema({
    url: String,
    
    id: String
}, {_id: false})

const commentSchema = mongoose.Schema({
    userId: mongoose.Types.ObjectId,

    comment: String
},  { timestamps: true })

const schema = mongoose.Schema({
    description: String,

    image: imageSchema,

    videoUrl: String,

    userId: mongoose.ObjectId,

    likes: [mongoose.ObjectId],

    comments: [commentSchema]
},  { timestamps: true })

export default mongoose.model("Post", schema)