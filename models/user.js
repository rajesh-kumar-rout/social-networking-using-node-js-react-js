import mongoose from "mongoose"

const imageSchema = mongoose.Schema({
    url: String,

    id: String
}, {_id: false})

const schema = mongoose.Schema({
    firstName: String,

    lastName: String,

    email: String,

    password: String,

    bio: String,

    birthDate: Date,

    work: String,

    currentCity: String,

    homeTown: String,

    school: String,

    college: String,

    relationship: String,

    gender: String,

    profileImage: imageSchema,

    coverImage: imageSchema,

    followings: [mongoose.ObjectId],

    followers: [mongoose.ObjectId]
}, { timestamps: true })

export default mongoose.model("User", schema)