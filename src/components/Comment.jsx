import { useContext } from "react"
import { fullName } from "../utils/functions"
import { AuthContext } from "./Auth"

export default function Comment({ comment, onDeleteComment }) {
    const { currentUser } = useContext(AuthContext)

    return (
        <div className="comment">
            <div className="comment-header">
                <p className="card-title">{fullName(comment.user)}</p>
                <p className="comment-created-at">1 month ago</p>
            </div>
            <div className="comment-body">
                {comment.comment}
            </div>
            {comment.user._id === currentUser._id && (
                <div className="comment-footer">
                    <button className="btn btn-sm btn-primary">Remove</button>
                </div>
            )}
        </div>
    )
}