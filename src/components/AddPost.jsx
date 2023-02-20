import { useContext, useState } from "react"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { fileToString } from "../utils/functions"
import { addPostSchema } from "../utils/validationSchema"
import { AuthContext } from "./Auth"
import Image from "./Image"

export default function AddPost({ onFetchPosts }) {
    const { currentUser } = useContext(AuthContext)

    const [inputs, setInputs] = useState({
        image: "",
        videoUrl: "",
        description: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [type, setType] = useState()

    const handleImageClick = () => {
        setType("image")

        setInputs({ ...inputs, videoUrl: "" })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            await addPostSchema.validate(inputs)
        } catch ({ errors }) {
            return toast.error(errors?.[0])
        }

        setIsSubmitting(true)

        await axios.post("/posts", inputs)

        setInputs({
            image: "",
            videoUrl: "",
            description: ""
        })

        setType()

        setIsSubmitting(false)

        toast.success("Post created successfully")

        onFetchPosts()
    }

    const handleChange = async (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.type === "file" ? await fileToString(event) : event.target.value
        })
    }

    const handleVideoUrlClick = event => {
        setType("videoUrl")

        setInputs({ ...inputs, image: "" })
    }

    const handleVideoUrlRemoved = event => {
        setType()

        setInputs({ ...inputs, videoUrl: "" })
    }

    const handleImageRemoved = event => {
        setType()

        setInputs({ ...inputs, image: "" })
    }

    return (
        <form className="add-post" onSubmit={handleSubmit}>
            <div className="add-post-header">
                <Image className="add-post-img" src={currentUser.profileImage?.url} alt={process.env.REACT_APP_DEFAULT_PROFILE_IMG} />

                <div className="add-post-right">
                    <textarea
                        name="description"
                        className="form-control"
                        style={{ resize: "none" }}
                        onChange={handleChange}
                        value={inputs.description}
                        placeholder={`What's on your mind, ${currentUser.firstName}?`}
                    />

                    {type === "image" && (
                        <input
                            type="file"
                            name="image"
                            className="form-control"
                            style={{ marginTop: 4 }}
                            onChange={handleChange}
                            placeholder="Enter video link"
                        />
                    )}

                    {type === "videoUrl" && (
                        <input
                            type="text"
                            name="videoUrl"
                            className="form-control"
                            style={{ marginTop: 4 }}
                            placeholder="Youtube video link"
                            onChange={handleChange}
                            value={inputs.videoUrl}
                        />
                    )}
                </div>
            </div>

            <div className="add-post-footer">
                {type === "videoUrl" ? (
                    <button type="button" className="btn btn-sm btn-danger" onClick={handleVideoUrlRemoved}>
                        Remove Video
                    </button>
                ) : (
                    <button type="button" className="btn btn-sm btn-danger" onClick={handleVideoUrlClick}>
                        Add Video
                    </button>
                )}

                {type === "image" ? (
                    <button type="button" className="btn btn-sm btn-success" onClick={handleImageRemoved}>
                        Remove Photo
                    </button>
                ) : (
                    <button type="button" className="btn btn-sm btn-success" onClick={handleImageClick}>
                        Add Photo
                    </button>
                )}

                <button className="btn btn-sm btn-primary" type="submit" disabled={isSubmitting}>Save</button>
            </div>
        </form>
    )
}