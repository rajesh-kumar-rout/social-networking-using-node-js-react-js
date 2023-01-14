import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./Auth"
import { toast } from "react-toastify"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import axios from "../utils/axios"
import { dateToAgo } from "../utils/functions"
import Comment from "./Comment"

export default function CommentBox({ postId, onCommentDelete, onCommentCreate }) {
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

        onCommentDelete(postId)

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
                            src={currentUser.profileImgUrl ? currentUser.profileImgUrl : DEFAULT_PROFILE_IMG}
                            className="h-9 w-9 rounded-full object-cover"
                        />

                        <form onSubmit={handleAddComment} className="flex-1">
                            <input
                                className="form-control text-sm"
                                name="comment"
                                placeholder="Write your comment..."
                            />
                            <p className="text-gray-600 mt-1 text-sm">Press enter to post.</p>
                        </form>
                    </div>

                    {comments.map(comment => (
                        <Comment
                            onDeleteComment={handleDeleteComment}
                            key={comment.id}
                        />
                    ))}
                </>
            )}
        </div>
    )
}