import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./Auth"
import { toast } from "react-toastify"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import axios from "../utils/axios"
import { dateToAgo } from "../utils/functions"
import Comment from "./Comment"

const commentss = [
    {
        profileImgUrl: "https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?b=1&s=170667a&w=0&k=20&c=VEE1756TeCzYH2uPsFZ_P8H3Di2j_jw8aOT6zd7V8JY=",

        comment: 'Lorem Ipsum is simply dummy text of the printing',
        createdAt: '1 day ago',
        userName: 'Amir Khan'
    },
    {
        profileImgUrl: "https://media.istockphoto.com/id/1370690627/photo/side-view-of-woman-wants-to-scream-covers-mouth-with-palm-stares-at-something-terrible.jpg?b=1&s=170667a&w=0&k=20&c=N6-Ip3xict73SOJ15F-84-Z51_ZmXvvoXwZlTBi9POg=",

        comment: 'Lorem Ipsum is simply dummy text of the printing',
        createdAt: '2 day ago',
        userName: 'John Abraham'
    },
]

export default function CommentBox({ postId, onCommentDelete, onCommentCreate }) {
    const [comments, setComments] = useState(commentss)
    const [isLoading, setIsLoading] = useState(true)
    const { currentUser } = useContext(AuthContext)

    async function fetchComments() {
        const { data } = await axios.get(`/posts/${postId}/comments`)
        // setComments(data)
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
                            <textarea
                                className="form-control text-sm resize-none bg-gray-100"
                                name="comment"
                                placeholder="Write your comment..."
                            />
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