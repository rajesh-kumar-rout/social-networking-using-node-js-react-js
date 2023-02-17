import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { DEFAULT_COVER_IMG, DEFAULT_PROFILE_IMG } from "../utils/constants"
import { AuthContext } from "./Auth"
import Comment from "./Comment"
import Image from "../components/Image"
import Loader from "./Loader"

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

        await axios.post(`/posts/${postId}/comments`, { comment })

        fetchComments()
    }

    async function handleDeleteComment(commentId) {
        setIsLoading(true)

        await axios.delete(`/posts/${postId}/comments/${commentId}`)

        setComments(comments.filter(comment => comment._id !== commentId))

        setIsLoading(false)
    }

    useEffect(() => {
        fetchComments()
    }, [])

    return (
        <div className="comment-box">
            {isLoading ? (
                <div style={{ padding: "16px 16px 4px" }}>
                    <Loader />
                </div>
            ) : (
                <>
                    <div className="comment-form">
                        <Image src={currentUser.profileImage.url} alt={DEFAULT_PROFILE_IMG} className="comment-img" />

                        <form onSubmit={handleAddComment} className="comment-form-right">
                            <textarea
                                className="form-control"
                                style={{ resize: "none" }}
                                name="comment"
                                placeholder="Write your comment..."
                            />
                            <button className="btn btn-sm btn-primary">Post</button>
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