import { useContext, useEffect, useState } from "react"
import { AccountContext } from "./Account"
import Comment from "./Comment"
import axios from "../utils/axios"
import { toast } from "react-toastify"

export default function CommentList({ postId }) {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { account } = useContext(AccountContext)

    const fetchComments = async () => {
        const { data } = await axios.get(`/posts/${postId}/comments`)
        setComments(data)
        setIsLoading(false)
    }

    const handleAddComment = async (event) => {
        event.preventDefault()

        const comment = event.target.comment.value.trim()

        if (comment.length === 0 || comment.length > 255) return toast.error("Comment must be within 1-255 characters")

        setIsLoading(true)

        const { data } = await axios.post(`/posts/${postId}/comments`, { comment })

        const newComment = {
            id: data.id,
            comment: data.comment,
            createdAt: data.createdAt,
            userName: account.name,
            profileImgUrl: account.profileImgUrl,
            isCommented: 1
        }

        setComments([newComment, ...comments])
        setIsLoading(false)
    }

    const handleDeleteComment = async (commentId) => {
        setIsLoading(true)

        await axios.delete(`/posts/comments/${commentId}`)

        setComments(comments.filter(comment => comment.id !== commentId))
        setIsLoading(false)
    }

    useEffect(() => {
        fetchComments()
    }, [])

    return (
        <div className="comments">
            {isLoading ? (
                <p className="comments-loader-txt">Loading...</p>
            ) : (
                <>
                    <div className="comment">
                        <img src={account.profileImgUrl} className="comment-profile-img" />

                        <form onSubmit={handleAddComment} className="flex-1">
                            <input
                                className="form-control text-sm"
                                name="comment"
                                placeholder="Write your comment..."
                            />
                            <p className="comments-submit-hint">Press enter to post.</p>
                        </form>
                    </div>

                    {comments.map(comment => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            onDeleteComment={handleDeleteComment}
                        />
                    ))}
                </>
            )}
        </div>
    )
}