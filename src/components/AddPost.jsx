import { useContext, useState } from "react"
import axios from "../utils/axios"
import { toast } from "react-toastify"
import { AuthContext } from "./Auth"
import { getBase64 } from "../utils/functions"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"

export default function AddPost() {
    const [isLoading, setIsLoading] = useState(false)
    const { currentUser } = useContext(AuthContext)
    const [type, setType] = useState()

    async function handleSubmit(event) {
        event.preventDefault()

        const payload = {
            description: event.target.description.value.trim(),
            image: await getBase64(event.target.image?.files[0]),
            videoUrl: event.target.video?.value?.trim(),
        }

        if (!payload.description && !payload.image && !payload.videoUrl) return

        if (payload.description.length > 255) {
            return toast.error("You must describe within 255 characters")
        }

        setIsLoading(true)

        await axios.post("/posts", payload)

        setType()

        setIsLoading(false)

        event.target.reset()

        toast.success("Post created")
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-x-0 sm:border-x-2 border-gray-300 sm:rounded-md w-full sm:w-[600px] 
            mx-auto p-4"
        >
            <div className="flex items-start gap-3">
                <img className="w-10 h-10 object-cover rounded-full" src={currentUser.profileImageUrl ? currentUser.profileImageUrl : DEFAULT_PROFILE_IMG} alt="" />
                <div className="flex-1">
                    <textarea
                        name="description"
                        className="bg-gray-100 resize-none border-2 focus:ring-1 focus:border-teal-600 focus:ring-teal-600 
                        outline-none border-gray-300 p-2 rounded-md text-gray-800 w-full"
                        placeholder={`What's on your mind, ${currentUser.firstName}?`}
                    />

                    {type === "photo" && (
                        <input
                            type="file"
                            name="image"
                            className="bg-gray-100 resize-none border-2 focus:ring-2 focus:ring-teal-600 outline-none
                          border-gray-300 p-2 rounded-md text-gray-800 w-full mt-2"
                            placeholder="Enter video link"
                        />
                    )}

                    {type === "video" && (
                        <input
                            type="text"
                            name="video"
                            className="bg-gray-100 resize-none border-2 focus:ring-2 focus:ring-teal-600 outline-none
                          border-gray-300 p-2 rounded-md text-gray-800 w-full mt-2"
                            placeholder="Youtube video link"
                        />
                    )}
                </div>
            </div>

            <div className="border-t-2 border-t-gray-200 flex items-center gap-2 mt-4 pt-4 justify-end">
                {type === "video" ? (
                    <button
                        type="button"
                        className="btn btn-sm btn-yellow"
                        onClick={() => setType()}
                    >
                        Remove Video
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-sm btn-yellow"
                        onClick={() => setType("video")}
                    >
                        Add Video
                    </button>
                )}

                {type === "photo" ? (
                    <button
                        type="button"
                        className="btn btn-sm btn-purple"
                        onClick={() => setType()}
                    >
                        Remove Photo
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-sm btn-purple"
                        onClick={() => setType("photo")}
                    >
                        Add Photo
                    </button>
                )}

                <button
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={isLoading}
                >
                    Save
                </button>
            </div>
        </form>
    )
}