import { useContext } from "react"
import { dateToAgo, fullName } from "../utils/functions"
import { AuthContext } from "./Auth"
import Image from "./Image"

export default function Comment({ comment, onDeleteComment }) {
    const { currentUser } = useContext(AuthContext)

    return (
        <div className="comment">
            <div className="comment-header">
            <p className="comment-username">{fullName(comment.user)}</p>
                    <p className="comment-created-at">{dateToAgo(comment.createdAt)}</p>
            </div>

            <div className="comment-body">{comment.comment}</div>
            
            {comment.user._id === currentUser._id && (
                <div className="comment-footer" onClick={() => onDeleteComment(comment._id)}>
                    <button className="btn btn-sm btn-primary">Delete</button>
                </div>
            )}
        </div>
    )
}