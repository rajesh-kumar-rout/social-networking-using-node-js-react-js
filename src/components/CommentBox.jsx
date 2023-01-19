import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { AuthContext } from "./Auth"
import Comment from "./Comment"

export default function CommentBox({ postId }) {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { currentUser } = useContext(AuthContext)

    async function fetchComments() {
        const { data } = await axios.get(`/posts/${postId}/comments`)
        setComments(data)
        setIsLoading(false)
    }

    async function handleAddComment(event) {
        event.preventDefault()

        const comment = event.target.comment.value.trim()

        if (comment.length === 0 || comment.length > 255) return toast.error("Comment must be within 1-255 characters")

        setIsLoading(true)

        const { data } = await axios.post(`/posts/${postId}/comments`, { comment })

        setComments([data, ...comments])

        setIsLoading(false)
    }

    async function handleDeleteComment(commentId) {
        setIsLoading(true)

        await axios.delete(`/posts/comments/${commentId}`)

        setComments(comments.filter(comment => comment.id !== commentId))

        setIsLoading(false)
    }

    useEffect(() => {
        fetchComments()
    }, [])

    return (
        <div className="border-t-2 border-gray-300">
            {isLoading ? (
                <div className="py-4">
                    <div className="h-10 w-10 rounded-full mx-auto border-4 border-indigo-600 border-b-transparent animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="flex gap-3 px-3 py-4 ">
                        <img
                            src={currentUser.profileImageUrl ? currentUser.profileImageUrl : DEFAULT_PROFILE_IMG}
                            className="h-9 w-9 rounded-full object-cover"
                        />

                        <form onSubmit={handleAddComment} className="flex-1 flex flex-col gap-2 justify-end items-end">
                            <textarea
                                className="form-control bg-gray-100 text-sm resize-none"
                                name="comment"
                                placeholder="Write your comment..."
                            />
                            <button className="px-2 py-1 rounded bg-teal-600 text-white text-sm font-semibold">Post</button>
                        </form>
                    </div>

                    {comments.map(comment => (
                        <Comment
                            comment={comment}
                            onDeleteComment={handleDeleteComment}
                            key={comment.id}
                        />
                    ))}
                </>
            )}
        </div>
    )
}