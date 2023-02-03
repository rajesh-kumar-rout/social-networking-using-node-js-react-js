import mongoose from "mongoose"

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

    followings: [mongoose.ObjectId],

    followers: [mongoose.ObjectId]
})

export default mongoose.model("User", schema)